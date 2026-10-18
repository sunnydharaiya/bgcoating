// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  ClipboardCheck, 
  Coins, 
  FileCheck2, 
  Users, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Play, 
  LifeBuoy, 
  MessageSquare, 
  Clock, 
  Folder, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Search, 
  X, 
  Send, 
  Bot, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldCheck, 
  HelpCircle,
  Video
} from 'lucide-react';

export default function DashboardPage({ setActivePage }) {
  // Dynamic Date and Greeting
  const [greetingInfo, setGreetingInfo] = useState({
    greeting: 'GOOD MORNING',
    dateStr: 'WEDNESDAY, 5 AUGUST 2026'
  });

  // AI Assistant Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your BG CoatingOS™ AI Assistant. Ask me anything about coating specifications, DFT limits per SSPC-PA 2, dew point margins, or blast profile criteria.'
    }
  ]);

  // Ecosystem Overview Modal State
  const [ecosystemModalOpen, setEcosystemModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let greeting = 'GOOD MORNING';
      if (hours >= 12 && hours < 17) {
        greeting = 'GOOD AFTERNOON';
      } else if (hours >= 17) {
        greeting = 'GOOD EVENING';
      }

      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = now.toLocaleDateString('en-US', options).toUpperCase();
      setGreetingInfo({
        greeting,
        dateStr: dateFormatted
      });
    };
    updateTime();

    const handleOpenAi = () => setAiModalOpen(true);
    const handleOpenEcosystem = () => setEcosystemModalOpen(true);
    window.addEventListener('bg_open_ai_modal', handleOpenAi);
    window.addEventListener('bg_open_ecosystem_modal', handleOpenEcosystem);
    return () => {
      window.removeEventListener('bg_open_ai_modal', handleOpenAi);
      window.removeEventListener('bg_open_ecosystem_modal', handleOpenEcosystem);
    };
  }, []);

  const handleNav = (targetPage) => {
    if (setActivePage) {
      setActivePage(targetPage);
    }
  };

  const handleSendAi = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt.trim();
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    // Simulated Intelligent Assistant Response
    setTimeout(() => {
      let response = `Per ISO 8502-4 and SSPC regulations, ensure steel surface temperature is at least 3°C above the dew point before coating application.`;
      if (userMsg.toLowerCase().includes('dft') || userMsg.toLowerCase().includes('thickness')) {
        response = `SSPC-PA 2 Level 3 rule: Spot readings must average between 80% to 120% of specified NDFT. No individual gauge reading can fall below 80% minimum.`;
      } else if (userMsg.toLowerCase().includes('blast') || userMsg.toLowerCase().includes('surface')) {
        response = `For abrasive blasting per ISO 8501-1 Sa 2.5 (Near-White Metal), surface profile anchor pattern should satisfy 50–75 µm per ASTM D4417 Method B/C.`;
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: response }]);
    }, 600);
  };

  // Organogram Modules Data matching media_1791308020542.png
  const organogramModules = [
    {
      id: 'coating-calculator',
      title: 'Coating Calculator',
      subtitle: 'Smart calculators for accurate engineering results.',
      icon: Calculator,
      color: 'blue',
      badgeBg: 'bg-blue-600',
      badgeBorder: 'border-blue-500',
      lineColor: 'border-blue-500',
      bullets: [
        'Area Calculator',
        'Paint Consumption',
        'WFT / DFT Calculator',
        'Cost Estimation',
        'Surface Roughness',
        'Unit Conversion'
      ],
      target: 'coating-calculator'
    },
    {
      id: 'specification-reading',
      title: 'Specification Reading',
      subtitle: 'Read, interpret & manage coating specifications.',
      icon: FileText,
      color: 'cyan',
      badgeBg: 'bg-cyan-600',
      badgeBorder: 'border-cyan-500',
      lineColor: 'border-cyan-500',
      bullets: [
        'Specification Upload',
        'MNC Specifications',
        'Project Standards',
        'Clause Library',
        'Search & Filter',
        'Revision History'
      ],
      target: 'specification-reading'
    },
    {
      id: 'coating-procedure',
      title: 'Coating Procedure',
      subtitle: 'Create, manage & approve painting procedures.',
      icon: ClipboardCheck,
      color: 'emerald',
      badgeBg: 'bg-emerald-600',
      badgeBorder: 'border-emerald-500',
      lineColor: 'border-emerald-500',
      bullets: [
        'Procedure Templates',
        'Step-by-Step Builder',
        'Revision Control',
        'Workflow Approval',
        'Coating System Annexures',
        'Procedure Register'
      ],
      target: 'coating-procedure'
    },
    {
      id: 'estimation',
      title: 'Estimation',
      subtitle: 'Quick & detailed estimation with cost breakdown.',
      icon: Coins,
      color: 'indigo',
      badgeBg: 'bg-indigo-600',
      badgeBorder: 'border-indigo-500',
      lineColor: 'border-indigo-500',
      bullets: [
        'Quick Estimation',
        'Detailed Estimation',
        'Material Estimation',
        'Manpower Estimation',
        'Equipment Estimation',
        'Cost Summary'
      ],
      target: 'unit-rate-estimation'
    },
    {
      id: 'documentation-report',
      title: 'Documentation / Report',
      subtitle: 'Digital reports, records & data management made easy.',
      icon: Folder,
      color: 'amber',
      badgeBg: 'bg-amber-500',
      badgeBorder: 'border-amber-400',
      lineColor: 'border-amber-500',
      bullets: [
        'Inspection Reports',
        'Daily Reports',
        'Quality Records',
        'Image Management',
        'Document Library',
        'Export & Share'
      ],
      target: 'inspection-reporting'
    },
    {
      id: 'contractor-management',
      title: 'Contractor Management Module',
      subtitle: 'Manage contractors, performance & compliance.',
      icon: Users,
      color: 'blue',
      badgeBg: 'bg-blue-600',
      badgeBorder: 'border-blue-500',
      lineColor: 'border-blue-500',
      bullets: [
        'Contractor Register',
        'Performance Tracking',
        'Competency Matrix',
        'Document Verification',
        'Compliance Status',
        'Rating & Evaluation'
      ],
      target: 'contractor-management'
    },
    {
      id: 'training-certification',
      title: 'Training & Certification',
      subtitle: 'Learn, get certified & grow your expertise.',
      icon: GraduationCap,
      color: 'rose',
      badgeBg: 'bg-rose-500',
      badgeBorder: 'border-rose-400',
      lineColor: 'border-rose-500',
      bullets: [
        'Training Courses',
        'Online Learning',
        'Assessments',
        'Certification',
        'Progress Tracking',
        'Certificate Library'
      ],
      target: 'academy-lms'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      subtitle: 'AI powered intelligence for coating professionals.',
      icon: Sparkles,
      color: 'purple',
      badgeBg: 'bg-purple-600',
      badgeBorder: 'border-purple-500',
      lineColor: 'border-purple-500',
      bullets: [
        'Ask Anything',
        'DFT Calculator AI',
        'Procedure Generator',
        'Report Generator',
        'Image Analysis',
        'Voice Commands'
      ],
      target: 'ai-modal'
    }
  ];

  return (
    <div className="space-y-6 w-full pb-16 font-sans text-slate-800 animate-in fade-in duration-200">
      
      {/* ========================================================
          1. HEADER GREETING BANNER
          Matches media_1791308020542.png
          ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome to BG CoatingOS™
            </h1>
            <span className="bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] text-[10px] md:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md inline-flex items-center uppercase tracking-wider">
              {greetingInfo.greeting} · {greetingInfo.dateStr}
            </span>
          </div>
          <p className="text-xs md:text-[13px] text-slate-500 max-w-4xl leading-relaxed">
            Complete digital operating system for coating engineering, surface treatment, corrosion protection, inspection, estimation, planning and asset integrity management.
          </p>
        </div>

        <button
          onClick={() => setEcosystemModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-[#D97706] text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5 text-[#D97706]" />
          <span>View Ecosystem Overview</span>
        </button>
      </div>

      {/* ========================================================
          2. COMPLETE MODULE ORGANOGRAM
          Matches media_1791308020542.png
          ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 overflow-hidden">
        
        {/* Header Label */}
        <div>
          <h2 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-widest">
            BG COATING OS – COMPLETE MODULE ORGANOGRAM
          </h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            One Platform. All Coating Operations.
          </p>
        </div>

        {/* Central Tree Diagram Container */}
        <div className="relative pt-2">
          
          {/* ROOT CENTRAL NODE */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-white border-2 border-[#F7941D] rounded-2xl px-5 py-3 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <img
                  src="/logo-2.png"
                  alt="BG Logo"
                  className="w-7 h-7 object-contain brightness-0 invert"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-left leading-tight">
                <span className="font-extrabold text-sm md:text-base text-slate-900 tracking-wider font-mono block">
                  BG COATING OS
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Complete Digital Operating System
                </span>
              </div>
            </div>
          </div>

          {/* SVG CONNECTOR LINES (Connecting Central Node to all 8 Module Columns) */}
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-16 pointer-events-none">
            {/* Center vertical stem down from root */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-8 w-[2px] bg-slate-300" />
            
            {/* Horizontal cross bar extending across all columns */}
            <div className="absolute top-8 left-[6.25%] right-[6.25%] h-[2px] bg-slate-300" />
            
            {/* 8 Vertical drops into each card */}
            <div className="absolute top-8 left-[6.25%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[18.75%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[31.25%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[43.75%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[56.25%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[68.75%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[81.25%] h-8 w-[2px] bg-slate-300" />
            <div className="absolute top-8 left-[93.75%] h-8 w-[2px] bg-slate-300" />
          </div>

          {/* 8 COLUMNS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10 pt-2">
            {organogramModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (mod.target === 'ai-modal') {
                      setAiModalOpen(true);
                    } else {
                      handleNav(mod.target);
                    }
                  }}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-md hover:border-amber-400/80 transition-all flex flex-col justify-between group cursor-pointer text-left"
                >
                  <div>
                    {/* Module Icon Badge */}
                    <div className="flex justify-center mb-3">
                      <div className={`w-9 h-9 rounded-xl ${mod.badgeBg} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5 text-white stroke-[2]" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#F7941D] text-center leading-tight mb-1 transition-colors">
                      {mod.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed mb-3 min-h-[28px]">
                      {mod.subtitle}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-1.5 text-[10px] text-slate-600 border-t border-slate-100 pt-2.5">
                      {mod.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-slate-400 shrink-0">•</span>
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Link Button */}
                  <div className="pt-3 mt-2 border-t border-slate-100/80 text-center">
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-[#F7941D] inline-flex items-center gap-1 transition-colors">
                      + More Tools
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ========================================================
          3. PLATFORM SUMMARY, RECENT ACTIVITY & QUICK ACCESS
          Matches media_1791308020542.png
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 1: PLATFORM SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Platform Summary</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </h3>
            </div>

            {/* 2x2 Metric Tiles */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight font-mono">8</span>
                  <span className="text-[10px] text-slate-500 font-medium block">Core Modules</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F7941D] flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight font-mono">50+</span>
                  <span className="text-[10px] text-slate-500 font-medium block">Smart Calculators</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight font-mono">100+</span>
                  <span className="text-[10px] text-slate-500 font-medium block">Report Templates</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight font-mono">500+</span>
                  <span className="text-[10px] text-slate-500 font-medium block">Standard References</span>
                </div>
              </div>

            </div>
          </div>

          {/* AI Banner Button */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between text-left hover:brightness-95 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-slate-900 block">AI Powered Intelligence</span>
                <span className="text-[10px] text-slate-500 block">Ask, Analyze &amp; Automate</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>

        {/* CARD 2: RECENT ACTIVITY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900">Recent Activity</h3>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">THIS SESSION</span>
            </div>

            <div className="space-y-3">
              
              <div className="flex items-start justify-between gap-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Specification Reading session started</span>
                    <span className="text-[10px] text-slate-500 block font-mono">Uploaded NORSOK M-501 Rev.7</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">22:45</span>
              </div>

              <div className="flex items-start justify-between gap-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Estimation session started</span>
                    <span className="text-[10px] text-slate-500 block font-mono">Tank - Internal Coating Estimation</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">22:30</span>
              </div>

              <div className="flex items-start justify-between gap-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Procedure draft created</span>
                    <span className="text-[10px] text-slate-500 block font-mono">Procedure for Epoxy Coating System</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">22:10</span>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => handleNav('knowledge')}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#F7941D] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Activity</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 3: QUICK ACCESS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900">Quick Access</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              
              <button
                onClick={() => handleNav('coating-calculator')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#F7941D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Launch Calculator
                </span>
              </button>

              <button
                onClick={() => handleNav('specification-reading')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-100 hover:border-cyan-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Open Specification
                </span>
              </button>

              <button
                onClick={() => handleNav('coating-procedure')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Create Procedure
                </span>
              </button>

              <button
                onClick={() => handleNav('unit-rate-estimation')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  New Estimation
                </span>
              </button>

              <button
                onClick={() => handleNav('inspection-reporting')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Folder className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Create Report
                </span>
              </button>

              <button
                onClick={() => setAiModalOpen(true)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 flex items-center gap-2.5 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  AI Assistant
                </span>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. NEED HELP? BOTTOM RESOURCES BAR
          Matches media_1791308020542.png
          ======================================================== */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">Need Help?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <button
            onClick={() => handleNav('knowledge')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs flex items-center gap-3 transition text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F7941D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#F7941D] transition-colors">
                Knowledge Base
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Guides, standards &amp; articles
              </span>
            </div>
          </button>

          <button
            onClick={() => handleNav('knowledge')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs flex items-center gap-3 transition text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#F7941D] transition-colors">
                Video Tutorials
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Step by step learning
              </span>
            </div>
          </button>

          <button
            onClick={() => handleNav('support')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs flex items-center gap-3 transition text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E8700A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#F7941D] transition-colors">
                Support Center
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Raise a ticket / Get help
              </span>
            </div>
          </button>

          <button
            onClick={() => handleNav('support')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs flex items-center gap-3 transition text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#F7941D] transition-colors">
                Contact Us
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                We are here to help
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* ========================================================
          5. AI ASSISTANT INTERACTIVE MODAL
          ======================================================== */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[520px] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Coating Intelligence AI Assistant</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Specialized in AMPP, SSPC, NACE, ISO &amp; ASTM Standards</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#181E29] text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAi} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about dew point margin, SSPC-PA 2, blast profile..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          6. ECOSYSTEM OVERVIEW MODAL
          ======================================================== */}
      {ecosystemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F7941D] text-white flex items-center justify-center shadow-xs">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ecosystem Architecture &amp; Operations</h3>
                  <p className="text-[10px] text-slate-500 font-mono">BG Group Complete Industrial Coating Operating Platform</p>
                </div>
              </div>
              <button
                onClick={() => setEcosystemModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>BG CoatingOS™</strong> brings together the entire lifecycle of industrial surface preparation, painting application, quality control, estimation, and workforce prequalification:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {organogramModules.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="font-bold text-slate-900 block">{m.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{m.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
