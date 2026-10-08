// src/tools/contractor/ContractorHub.jsx
import React, { useState, useEffect } from 'react';
import {
  Folder,
  Flame,
  Building2,
  Users,
  UserCheck,
  Hammer,
  Paintbrush,
  Gauge,
  Clock,
  Wrench,
  Package,
  Coins,
  AlertTriangle,
  HeartPulse,
  Search,
  CheckCircle2,
  Plus,
  RefreshCw,
  Maximize2,
  LayoutGrid,
  SlidersHorizontal,
  CloudSun,
  ClipboardList,
  Boxes,
  UserPlus,
  FolderPlus,
  BarChart3,
  FileText,
  Bell,
  Settings,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  CircleDot,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ContractorHub({
  state,
  kpis,
  onOpenDailyProgress,
  onOpenStockUpdate,
  onOpenAddEmployee,
  onOpenCreateProject,
  onNavigateSection
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setLiveTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto pb-16 font-sans text-slate-800 animate-in fade-in duration-200">
      
      {/* ========================================================
          1. HERO BANNER: EXECUTIVE COMMAND CENTER
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="bg-gradient-to-br from-[#2D160E] via-[#200F09] to-[#170905] border border-[#5A2C18] rounded-2xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Block: Logo + Text + Badges + Action Buttons */}
          <div className="flex items-start gap-4 md:gap-5">
            {/* Square Logo Box */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-lg border border-amber-500/20">
              <img
                src="/logo-2.png"
                alt="BG Coating Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/vite.svg';
                }}
              />
            </div>

            {/* Title & Content */}
            <div className="space-y-2">
              
              {/* Eyebrow Capsule */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[9px] md:text-[10px] font-mono font-bold tracking-widest text-[#E89A3C] uppercase">
                <span>✦ EXECUTIVE COMMAND CENTER</span>
                <span className="text-white/40">·</span>
                <span>COATING CONTRACTOR MANAGEMENT</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl md:text-2xl lg:text-[28px] font-extrabold text-white tracking-tight leading-tight">
                Good morning, <span className="text-[#F7941D]">Gaurav Changawala</span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-xs md:text-[13px] text-slate-300 max-w-2xl leading-relaxed">
                BG Group of Paint and Coating Consultants — live visibility of projects, manpower, productivity, and resources across all sites, in one premium command center.
              </p>

              {/* Status Meta Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Status: Active
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-slate-300">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  All Sites
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-slate-300">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Friday, 05 July 2026
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-amber-300/80">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Last sync: 30s ago, 10:42
                </span>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={onOpenDailyProgress}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-white" />
                  <span>Daily Progress Update</span>
                </button>

                <button
                  onClick={onOpenStockUpdate}
                  className="px-3.5 py-2 rounded-xl bg-[#261812] hover:bg-[#332018] text-slate-200 border border-[#5A2C18] font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Monthly Stock Update</span>
                </button>

                <button
                  onClick={() => onNavigateSection && onNavigateSection('daily-dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-[#261812] hover:bg-[#332018] text-slate-200 border border-[#5A2C18] font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Daily 10 Dashboard</span>
                </button>

                <button
                  onClick={() => onNavigateSection && onNavigateSection('executive-dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-[#261812] hover:bg-[#332018] text-slate-200 border border-[#5A2C18] font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Executive Dashboard</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Block: Utility icons strip + Local Time + Surat Weather */}
          <div className="flex flex-col items-end justify-between gap-4 self-stretch shrink-0">
            {/* Top mini utility icons */}
            <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 p-1 rounded-xl">
              <button
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Refresh Live Data"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Toggle Fullscreen"
                onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                  else document.exitFullscreen();
                }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="System Configuration"
                onClick={() => onNavigateSection && onNavigateSection('settings')}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weather & Time Cards */}
            <div className="space-y-2 w-full sm:w-auto">
              {/* Card 1: Local Time */}
              <div className="bg-[#261812]/90 border border-[#5A2C18] rounded-xl px-4 py-2 flex items-center justify-between gap-4 shadow-xs min-w-[150px]">
                <div className="text-left">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">
                    LOCAL TIME
                  </span>
                  <span className="text-base md:text-lg font-bold text-white font-mono leading-none block">
                    {liveTime || '10:53'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#3D2115] flex items-center justify-center text-[#F7941D]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2: Surat Weather */}
              <div className="bg-[#261812]/90 border border-[#5A2C18] rounded-xl px-4 py-2 flex items-center justify-between gap-4 shadow-xs min-w-[150px]">
                <div className="text-left">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">
                    SURAT
                  </span>
                  <span className="text-base md:text-lg font-bold text-white font-mono leading-none block">
                    27°C
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#3D2115] flex items-center justify-center text-amber-400">
                  <CloudSun className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          2. SEARCH BAR
          ======================================================== */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
        <input
          type="text"
          placeholder="Search employees, projects, assets, consumables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-[#F7941D] transition"
        />
      </div>

      {/* ========================================================
          3. OPERATIONS OVERVIEW (14 KPI Cards Grid)
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#F7941D] rounded-full"></span>
            <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
              Operations Overview
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            live data • click any card to drill in
          </span>
        </div>

        {/* Top Row: 9 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          
          {/* Card 1: Total Projects */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-amber-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.totalProjects}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Total Projects
            </div>
          </div>

          {/* Card 2: Active (DPR) */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-rose-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.activeDpr}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Active (DPR)
            </div>
          </div>

          {/* Card 3: Sites */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-pink-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.sitesCount}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Sites
            </div>
          </div>

          {/* Card 4: Workforce */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-amber-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.workforceCount}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Workforce
            </div>
          </div>

          {/* Card 5: Present Today */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-emerald-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.presentToday}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Present Today
            </div>
            {/* Sparkline mini line */}
            <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/4 rounded-full"></div>
            </div>
          </div>

          {/* Card 6: Surface Prep. Today */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-slate-700 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Hammer className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.surfacePrepToday} <span className="text-xs font-normal text-slate-500">m²</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Surface Prep. Today
            </div>
            <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-1/6 rounded-full"></div>
            </div>
          </div>

          {/* Card 7: Painting / Coating Today */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-rose-600 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Paintbrush className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.paintCoatToday} <span className="text-xs font-normal text-slate-500">m²</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Painting / Coating Today
            </div>
            <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-1/6 rounded-full"></div>
            </div>
          </div>

          {/* Card 8: Productivity MTD */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-purple-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Gauge className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.productivityMtd} <span className="text-[9px] font-normal text-slate-500">m²/m-d</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Productivity MTD
            </div>
            <span className="text-[9px] font-mono text-rose-500 font-semibold block mt-0.5">
              ▼ 100%
            </span>
          </div>

          {/* Card 9: OT Hours MTD */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-indigo-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.otHoursMtd} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              OT Hours MTD
            </div>
            <span className="text-[9px] font-mono text-rose-500 font-semibold block mt-0.5">
              ▼ 100%
            </span>
          </div>

        </div>

        {/* Bottom Row: 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          
          {/* Card 10: Assets */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-purple-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Wrench className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.assetsCount}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Assets
            </div>
          </div>

          {/* Card 11: Consumables */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-sky-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Package className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.consumablesCount}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Consumables
            </div>
          </div>

          {/* Card 12: Monthly CTC */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-amber-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              ₹{kpis.monthlyCtc.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Monthly CTC
            </div>
          </div>

          {/* Card 13: Critical Alerts */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-rose-400 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-xl font-extrabold text-slate-800 font-mono leading-tight">
              {kpis.criticalAlerts}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Critical Alerts
            </div>
          </div>

          {/* Card 14: Project Health */}
          <div className="bg-white border border-slate-200 border-t-2 border-t-rose-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition cursor-pointer">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[10px]">↗</span>
            </div>
            <div className="text-base font-extrabold text-rose-500 font-mono leading-tight pt-1">
              {kpis.projectHealth}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Project Health
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          4. QUICK ACTIONS STRIP
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#F7941D] rounded-full"></span>
            <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
              Quick Actions
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            jump straight in
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          
          <button
            onClick={onOpenDailyProgress}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <ClipboardList className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Daily Progress Update
            </span>
          </button>

          <button
            onClick={onOpenStockUpdate}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-orange-50 text-[#F7941D] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Boxes className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Monthly Stock Update
            </span>
          </button>

          <button
            onClick={onOpenAddEmployee}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Add Employee
            </span>
          </button>

          <button
            onClick={onOpenCreateProject}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FolderPlus className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Create Project
            </span>
          </button>

          <button
            onClick={() => onNavigateSection && onNavigateSection('executive-dashboard')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Executive Dashboard
            </span>
          </button>

          <button
            onClick={() => onNavigateSection && onNavigateSection('daily-dashboard')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Daily 10
            </span>
          </button>

          <button
            onClick={() => onNavigateSection && onNavigateSection('notifications')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Notifications
            </span>
          </button>

          <button
            onClick={() => onNavigateSection && onNavigateSection('settings')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs transition text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 leading-tight">
              Settings / Backup
            </span>
          </button>

        </div>
      </div>

      {/* ========================================================
          5. ANALYTICS & INSIGHTS - ROW 1
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#F7941D] rounded-full"></span>
            <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
              Analytics &amp; Insights
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            this month
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Card 1: Project Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>Project Status</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 flex items-center justify-center mb-2">
                <span className="text-xs font-bold text-slate-700">3 Total</span>
              </div>
              <span className="text-xs text-slate-500">1 Active (33%) • 2 Planned / On Hold</span>
            </div>
          </div>

          {/* Card 2: This Month — Daily Painting / Coating Area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-[#F7941D]" />
                <span>This Month — Daily Painting / Coating Area</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-full h-24 flex items-end justify-between gap-1 px-2 pb-2 border-b border-slate-100">
                {[12, 18, 0, 24, 45, 10, 80, 0, 100, 0, 24, 0, 0, 0].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-xs transition-all hover:brightness-110"
                      style={{ height: `${Math.max(4, (h / 100) * 80)}px` }}
                      title={`Day ${i + 1}: ${h} m²`}
                    />
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-2">
                MTD Cumulative Output: 224 m² Surface Protected
              </span>
            </div>
          </div>

          {/* Card 3: Productivity Radial Gauge */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Gauge className="w-4 h-4 text-purple-500" />
                <span>Productivity</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                BG Group of Paint &amp; Coating Consultant
              </span>
            </div>
            
            {/* Speedometer Gauge Representation */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-2">
              <div className="relative w-36 h-20 flex items-end justify-center">
                {/* Gauge Arc */}
                <svg className="w-36 h-20 overflow-visible" viewBox="0 0 100 50">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 30 22"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Gauge needle at zero */}
                  <circle cx="50" cy="50" r="4" fill="#64748B" />
                  <line x1="50" y1="50" x2="20" y2="35" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center mt-1">
                <div className="text-lg font-extrabold text-slate-800 font-mono">0</div>
                <div className="text-[10px] text-slate-400 font-mono">target 0</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          6. ANALYTICS & INSIGHTS - ROW 2
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Card 1: Manpower Distribution (MTD) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Manpower Distribution (MTD)</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-center">
                <span className="text-lg font-bold text-slate-800 block">1</span>
                <span className="text-[10px] text-slate-400">Blaster</span>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-slate-800 block">1</span>
                <span className="text-[10px] text-slate-400">Planner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Project Progress (MTD) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <TrendingUp className="w-4 h-4 text-[#F7941D]" />
            <span>Project Progress (MTD)</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            {/* Empty triangle illustration */}
            <div className="w-10 h-10 border-r-2 border-b-2 border-slate-200 rotate-45 mb-2 opacity-60"></div>
            <span className="text-xs text-slate-400 font-mono">
              No project activity this month
            </span>
          </div>
        </div>

        {/* Card 3: July Activity Calendar Heatmap */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>July Activity</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">
              orange = work logged
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center pt-2">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-slate-400 font-bold py-0.5">{d}</div>
              ))}
              {[null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => {
                const isSelected = day === 5;
                return (
                  <div
                    key={i}
                    className={`py-1 rounded text-[10px] ${
                      !day
                        ? 'text-transparent'
                        : isSelected
                        ? 'border border-[#F7941D] text-[#F7941D] font-bold bg-[#F7941D]/10'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {day || ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          7. MIDDLE ROW: RECENT ACTIVITY & AI DAILY SUMMARY
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        
        {/* Left: Recent Activity Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Recent Activity</span>
          </div>

          <div className="divide-y divide-slate-100">
            {state.dailyLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-[#F7941D] flex items-center justify-center shrink-0 mt-0.5">
                    {log.type === 'transfer' ? (
                      <Boxes className="w-3.5 h-3.5" />
                    ) : log.type === 'stock' ? (
                      <Package className="w-3.5 h-3.5" />
                    ) : (
                      <ClipboardList className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{log.action}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {log.details}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {log.date ? new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '28 Jun'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Daily Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI Daily Summary</span>
          </div>

          <div className="space-y-2.5">
            {/* Pill 1: Blue highlight */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Today (05 Jul 2026):</span> 0 m² surface preparation, 0 m² painting / coating, 0 present across all sites.
              </div>
            </div>

            {/* Pill 2: Indigo highlight */}
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-900 leading-relaxed">
              <CircleDot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Month-to-date productivity:</span> 0 m²/man-day (no output yet).
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          8. MATERIAL STOCK ALERTS & LATEST STOCK TRANSACTIONS
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Left: Material Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Material Stock Alerts</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-2.5">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-medium text-slate-700">
              All consumables above threshold
            </span>
          </div>
        </div>

        {/* Right: Latest Stock Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Package className="w-4 h-4 text-sky-500" />
            <span>Latest Stock Transactions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {state.stockTransactions.map((tx, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{tx.item}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">{tx.note}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{tx.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================
          9. WORK SCHEDULE, SURFACE AREA PROGRESS & ASSET STATUS
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Card 1: Today's Work Schedule */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Today's Work Schedule</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">05 Jul 2026</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-xs text-slate-400 font-mono">
              Nothing logged today yet — add a Daily Progress entry
            </span>
          </div>
        </div>

        {/* Card 2: Surface Area Progress (MTD) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-[#F7941D]" />
            <span>Surface Area Progress (MTD)</span>
          </div>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E8700A]"></span>
                Surface Preparation
              </span>
              <span className="font-bold text-slate-800 font-mono">0 m²</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
                Painting / Coating
              </span>
              <span className="font-bold text-slate-800 font-mono">0 m²</span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              Coating overrun of surface prepared area: 0%
            </div>
          </div>
        </div>

        {/* Card 3: Asset Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Wrench className="w-4 h-4 text-purple-500" />
            <span>Asset Status</span>
          </div>

          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Compressor</span>
              <span className="font-bold font-mono text-rose-500">1</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          10. BOTTOM ROW: MONTHLY ACHIEVEMENT & NOT YET TRACKED
          Matches media_1791306666911.png
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        
        {/* Left: Monthly Achievement Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Monthly Achievement Trend</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">last 6 months - m²</span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 px-4 py-8 border-b border-slate-100">
            {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full max-w-[36px] bg-amber-500/20 border-t-2 border-amber-500 rounded-t-xs"
                  style={{ height: `${[20, 35, 50, 40, 65, 10][i]}px` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Not Yet Tracked */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Not Yet Tracked</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
              ✓ Completed status
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold">
              ⏱ Deadlines
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-semibold">
              ⏳ Pending approvals
            </span>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-semibold">
              🛡 Safety / Quality
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono font-semibold">
              👷 Contractor running
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            These need dedicated capture fields: project status &amp; dates, approvals, safety/quality, multi-contractor... add the modules and they light up here automatically.
          </p>
        </div>

      </div>

    </div>
  );
}
