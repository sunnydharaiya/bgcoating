import React from 'react';
import { 
  Sparkles, 
  BarChart2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  Eye, 
  Printer, 
  ArrowRight
} from 'lucide-react';

export default function UnitRateHub({ 
  formData, 
  onUpdateForm, 
  onNavigateSubTool, 
  onOpenPreview, 
  onOpenPrint,
  records = []
}) {
  const totalEstimations = records.length;
  const draftEstimations = records.filter(r => r.status === 'Draft' || !r.status).length;
  const approvedEstimations = records.filter(r => r.status === 'Approved').length;
  const pendingEstimations = records.filter(r => r.status === 'Pending' || r.status === 'In Review').length;

  const handleNewGeneration = () => {
    onNavigateSubTool('project-info');
  };

  return (
    <div className="space-y-8 w-full pb-6 animate-in fade-in duration-200">
      
      {/* 1. Hero Card (Exact match to Screenshot 3) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(20,24,32,0.04)] border border-[#E6E8EC] p-6 md:p-8 text-center relative">
        
        {/* Top Capsule Badge */}
        <div className="inline-block mb-4">
          <span className="bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] text-[10px] md:text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            STANDARD SHEET • UNIT-RATE METHOD
          </span>
        </div>

        {/* Title and Logo Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm p-2 flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B222C] tracking-tight">
              Quick Unit-Rate <span className="text-[#F7941D]">Painting Estimation</span>
            </h1>
            <p className="text-xs md:text-[13px] text-[#64748B] mt-2 leading-relaxed">
              A premium estimation platform by BG Group of Paint and Coating Consultant — define scope, components, coating system &amp; areas; the system auto-fills the unit-rate table for Blasting, Raw Material, Application &amp; Miscellaneous costs, with built-in Paint &amp; Abrasive calculators.
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
          <span className="text-[11px] text-[#64748B] mt-2.5">
            Start a new estimation — all sections open for guided data entry
          </span>
        </div>

      </div>

      {/* 2. Estimation Overview (Exact match to Screenshot 3) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#F7941D] rounded-full inline-block"></span>
            <h2 className="text-sm md:text-base font-bold text-[#1B222C]">
              Estimation Overview
            </h2>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-medium">
            Saved quick estimations
          </span>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Estimations */}
          <div 
            onClick={() => onNavigateSubTool('register')}
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
                All saved sheets
              </span>
            </div>
          </div>

          {/* Card 2: Draft Estimations */}
          <div 
            onClick={() => onNavigateSubTool('register')}
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
                Draft Estimations
              </span>
              <span className="text-[10px] text-[#64748B] block">
                Work in progress
              </span>
            </div>
          </div>

          {/* Card 3: Approved */}
          <div 
            onClick={() => onNavigateSubTool('register')}
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

          {/* Card 4: Pending */}
          <div 
            onClick={() => onNavigateSubTool('register')}
            className="bg-white rounded-xl border border-[#E6E8EC] border-t-2 border-t-amber-500 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#1B222C] font-mono block">
                {pendingEstimations}
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

      {/* 3. Quick Actions (Exact match to Screenshot 3) */}
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
            onClick={() => onNavigateSubTool('register')}
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
                Open all saved estimations
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

      {/* 4. Corporate Footer (Exact match to Screenshot 3) */}
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
          Industrial Coat Estimation • Surface Protection • Coating Engineering
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
