import React from 'react';
import {
  Sparkles,
  BarChart2,
  Edit3,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  FileText,
  Eye,
  Printer,
  ArrowRight
} from 'lucide-react';

export default function ManpowerHub({ 
  state, 
  metrics = {}, 
  onNavigate, 
  reports = [],
  onOpenPreview,
  onOpenPrint
}) {
  const totalEstimations = reports.length;
  const draftEstimations = reports.filter(r => r.status === 'Draft' || !r.status).length;
  const approvedEstimations = reports.filter(r => r.status === 'Approved').length;
  
  // Calculate combined value
  const combinedTotal = reports.reduce((acc, r) => acc + (parseFloat(r.grand) || 0), 0);
  const combinedFormatted = combinedTotal > 0 
    ? `₹${combinedTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    : '₹0';

  const handleNewGeneration = () => {
    if (onNavigate) {
      onNavigate('project-info');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* 1. Hero Card (Exact match to media_1791302836632.png) */}
      <div className="bg-gradient-to-br from-[#2D160E] via-[#200F09] to-[#170905] border border-[#5A2C18] rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white relative shadow-xl max-w-4xl mx-auto">
        
        {/* Top Capsule Badge */}
        <div className="inline-block mb-4">
          <span className="bg-[#3D1D10] text-[#E89A3C] border border-[#6B371F] text-[10px] md:text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E89A3C]"></span>
            <span>INDUSTRIAL PROJECT ESTIMATION • MANPOWER BASED</span>
          </span>
        </div>

        {/* Title and Logo Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border border-white/20 p-2 shadow-md flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Painting Project <span className="text-[#F7941D]">Estimation System</span>
            </h1>
            <p className="text-xs md:text-[13px] text-slate-300 mt-2 leading-relaxed">
              A premium manpower-based estimation platform by BG Group of Paint and Coating Consultant — integrates project inputs, blasting cost, paint application, raw material, manpower CTC, abrasives &amp; diesel into one platform with a detailed commercial summary and dashboard.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleNewGeneration}
            className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:from-[#E8700A] hover:to-[#D97706] text-white font-extrabold text-xs md:text-sm px-8 py-3 rounded-full shadow-[0_4px_16px_rgba(247,148,29,0.35)] flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white text-white" />
            <span className="tracking-wide uppercase font-mono">NEW GENERATION</span>
          </button>
          <span className="text-[11px] text-[#A37B69] mt-2.5">
            Start a fresh estimation — all modules ready for guided data entry
          </span>
        </div>

      </div>

      {/* 2. Estimation Overview (Exact match to media_1791302836632.png) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#F7941D] rounded-full inline-block"></span>
            <h2 className="text-sm md:text-base font-bold text-[#1B222C]">
              Estimation Overview
            </h2>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-medium">
            Saved estimations
          </span>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Estimations */}
          <div 
            onClick={() => onNavigate && onNavigate('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-sky-500 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {totalEstimations}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Total Estimations
              </span>
              <span className="text-[10px] text-[#64748B] block">
                All saved records
              </span>
            </div>
          </div>

          {/* Card 2: Drafts */}
          <div 
            onClick={() => onNavigate && onNavigate('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-orange-500 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {draftEstimations}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Drafts
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Work in progress
              </span>
            </div>
          </div>

          {/* Card 3: Approved */}
          <div 
            onClick={() => onNavigate && onNavigate('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-emerald-500 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {approvedEstimations}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Approved
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Validated &amp; signed off
              </span>
            </div>
          </div>

          {/* Card 4: Combined Value */}
          <div 
            onClick={() => onNavigate && onNavigate('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-indigo-500 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {combinedFormatted}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Combined Value
              </span>
              <span className="text-[10px] text-[#64748B] block">
                All estimations
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Quick Actions (Exact match to media_1791302836632.png) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#F7941D] rounded-full inline-block"></span>
            <h2 className="text-sm md:text-base font-bold text-[#1B222C]">
              Quick Actions
            </h2>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-medium">
            Jump straight in
          </span>
        </div>

        {/* 4 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: New Generation */}
          <div 
            onClick={handleNewGeneration}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7941D] to-[#E8700A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors block">
                New Generation
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Start a fresh estimation
              </span>
            </div>
          </div>

          {/* Action 2: Report Register */}
          <div 
            onClick={() => onNavigate && onNavigate('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors block">
                Report Register
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Open all saved records
              </span>
            </div>
          </div>

          {/* Action 3: Preview Latest */}
          <div 
            onClick={onOpenPreview}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#B45309] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors block">
                Preview Latest
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Read-only report preview
              </span>
            </div>
          </div>

          {/* Action 4: Print Existing (PRO) */}
          <div 
            onClick={onOpenPrint}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C2D12] to-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors">
                  Print Existing
                </span>
                <span className="bg-amber-500/20 text-[#D97706] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Excel-format printable view
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Corporate Footer (Exact match to media_1791302836632.png) */}
      <footer className="bg-[#181E29] text-white py-6 px-6 rounded-2xl text-center space-y-2 select-none shadow-md">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shadow-2xs">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xs md:text-sm">
            <span className="text-[#F7941D]">BG GROUP</span> of Paint and Coating Consultant
          </span>
        </div>

        <p className="text-[11px] text-slate-300 font-medium">
          Industrial Cost Estimation • Surface Protection • Coating Engineering
        </p>

        <p className="text-[10px] text-slate-400">
          E-102, Akash Echo Point, Bhimrad, Surat - 395007, Gujarat, India &nbsp;|&nbsp; +91 99258 10408 &nbsp;|&nbsp; support@bgcoating.com &nbsp;|&nbsp; www.bgcoating.com
        </p>

        <p className="text-[9px] text-slate-500 font-mono pt-1">
          &copy; 2026 BG Group of Paint and Coating Consultant. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
