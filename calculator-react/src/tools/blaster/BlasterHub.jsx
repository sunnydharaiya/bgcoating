import React from 'react';
import {
  BarChart2,
  Edit3,
  CheckCircle2,
  Award,
  ChevronRight,
  Eye,
  Printer,
  Rocket,
  Folder,
  FileText
} from 'lucide-react';

export default function BlasterHub({
  state,
  metrics = {},
  reports = [],
  onNavigate,
  onApplyPreset,
  onNewGeneration,
  onOpenPreview,
  onOpenPrint
}) {
  const totalReports = reports.length;
  const draftReports = reports.filter(r => r.status === 'Draft' || !r.status).length;
  const approvedReports = reports.filter(r => r.status === 'Approved').length;
  const pendingReports = reports.filter(r => r.status === 'Pending' || r.verdict === 'PENDING').length;

  const handleStartNew = () => {
    if (onNewGeneration) {
      onNewGeneration();
    } else if (onNavigate) {
      onNavigate('info');
    }
  };

  const handleGoRegister = () => {
    if (onNavigate) onNavigate('register');
  };

  const handleGoPreview = () => {
    if (onOpenPreview) {
      onOpenPreview();
    } else if (onNavigate) {
      onNavigate('preview');
    }
  };

  const handleGoPrint = () => {
    if (onOpenPrint) {
      onOpenPrint();
    } else if (onNavigate) {
      onNavigate('report');
    }
  };

  return (
    <div className="space-y-8 w-full pb-6 animate-in fade-in duration-200">
      
      {/* 1. Hero Card (Exact match to media_1791304029525.png) */}
      <div className="bg-gradient-to-br from-[#2D160E] via-[#200F09] to-[#170905] border border-[#5A2C18] rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white relative shadow-xl w-full">
        
        {/* Top Capsule Badge */}
        <div className="inline-block mb-4">
          <span className="bg-[#3D1D10] text-[#E89A3C] border border-[#6B371F] text-[10px] md:text-[11px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="text-[#F7941D]">✦</span>
            <span>DIGITAL QUALIFICATION • BLASTER • SURFACE PREPARATION OPERATOR</span>
          </span>
        </div>

        {/* Title and Logo Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border border-white/20 p-2 shadow-md flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Blaster / Operator Qualification <span className="text-[#F7941D]">&amp; Digital Reporting</span>
            </h1>
            <p className="text-xs md:text-[13px] text-slate-300 mt-2 leading-relaxed">
              A premium industrial qualification platform by BG Group of Paint and Coating Consultant — capture Project &amp; Operator data, Training &amp; Assessment, Environmental monitoring, Surface Preparation &amp; Abrasive control and Inspection results with real-time compliance to SSPC/NACE standards, dew-point monitoring and photo evidence; the system auto-validates limits, then generates MNC-grade printable qualification dossiers.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleStartNew}
            className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:from-[#E8700A] hover:to-[#D97706] text-white font-extrabold text-xs md:text-sm px-8 py-3 rounded-full shadow-[0_4px_16px_rgba(247,148,29,0.35)] flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
          >
            <Rocket className="w-4 h-4 fill-white text-white" />
            <span className="tracking-wide uppercase font-mono">NEW GENERATION</span>
          </button>
          <span className="text-[11px] text-[#A37B69] mt-2.5">
            Start a new qualification — all sheets open for guided data entry
          </span>
        </div>

      </div>

      {/* 2. Qualification Overview (Exact match to media_1791304029525.png) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#F7941D] rounded-full inline-block"></span>
            <h2 className="text-sm md:text-base font-bold text-[#1B222C]">
              Qualification Overview
            </h2>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-medium">
            Saved qualification reports
          </span>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Reports */}
          <div 
            onClick={handleGoRegister}
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
                {totalReports}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Total Reports
              </span>
              <span className="text-[10px] text-[#64748B] block">
                All saved reports
              </span>
            </div>
          </div>

          {/* Card 2: Draft Reports */}
          <div 
            onClick={handleGoRegister}
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
                {draftReports}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Draft Reports
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Work in progress
              </span>
            </div>
          </div>

          {/* Card 3: Approved */}
          <div 
            onClick={handleGoRegister}
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
                {approvedReports}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Approved
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Validated &amp; signed off
              </span>
            </div>
          </div>

          {/* Card 4: Pending */}
          <div 
            onClick={handleGoRegister}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-sky-400 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {pendingReports}
              </span>
              <span className="text-xs font-bold text-[#1B222C] block mt-0.5">
                Pending
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Awaiting approval
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Quick Actions (Exact match to media_1791304029525.png) */}
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
            onClick={handleStartNew}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors block">
                New Generation
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Start a fresh qualification
              </span>
            </div>
          </div>

          {/* Action 2: Report Register */}
          <div 
            onClick={handleGoRegister}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors block">
                Report Register
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Open all saved reports
              </span>
            </div>
          </div>

          {/* Action 3: Preview Latest */}
          <div 
            onClick={handleGoPreview}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Eye className="w-5 h-5 text-white" />
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

          {/* Action 4: Print Existing */}
          <div 
            onClick={handleGoPrint}
            className="bg-white rounded-xl border border-[#E6E8EC] p-3.5 shadow-2xs hover:shadow-sm hover:border-[#F7941D] transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#1B222C] group-hover:text-[#F7941D] transition-colors truncate">
                  Print Existing
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#D97706]">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] block mt-0.5 truncate">
                Excel-format printable view
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Dark Corporate Footer (Exact match to media_1791304029525.png) */}
      <footer className="mt-10 rounded-2xl bg-[#141822] text-white py-6 px-6 text-center shadow-lg border border-[#232B3C] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded bg-white p-0.5 shrink-0 flex items-center justify-center">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xs md:text-sm tracking-wide text-white">
            BG GROUP • PAINT &amp; COATING CONSULTANT
          </span>
        </div>
        <p className="text-[11px] text-[#8F9CAE]">
          Corrosion Management · Surface Treatment · Coating Engineering Destination
        </p>
        <div className="pt-1 text-[11px] text-[#F7941D] flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono">
          <span>support@bgcoating.com</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span>www.bgcoating.com</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span>+91 99258 10408</span>
        </div>
      </footer>

    </div>
  );
}
