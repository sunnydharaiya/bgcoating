import React from 'react';
import { Crown, Check, X, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function PlanUpgradeModal({ isOpen, onClose, currentPlan = 'Free' }) {
  const { addToast } = useToast();

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Essential paint and surface area tools for field coating professionals.',
      features: [
        'Core Paint Suite (WFT, DFT, Coverage)',
        'Basic Geometry Surface Area (Pipe, Tank)',
        'Abrasive Consumption Matrix',
        'Standard PDF / Print Export',
        'Single User Session'
      ],
      current: currentPlan === 'Free',
      cta: 'Current Plan'
    },
    {
      name: 'Standard',
      price: '₹1,499',
      period: 'per month',
      desc: 'Quality assurance, compliance, and material reconciliation suite.',
      features: [
        'Everything in Free',
        'SSPC-PA 2 & ISO 19840 DFT Acceptance',
        'Salt Contamination ISO 8502-9 Engine',
        'Paint Material Reconciliation with Flow Diagram',
        'Abrasive Size vs. Profile & Recycling Tools',
        'Standard Email Support'
      ],
      popular: true,
      current: currentPlan === 'Standard',
      cta: 'Choose Standard'
    },
    {
      name: 'Premium',
      price: '₹2,999',
      period: 'per month',
      desc: 'Advanced engineering, TSA, PFP, and Life Cycle Cost analysis.',
      features: [
        'Everything in Standard',
        '25-Year Life Cycle Cost (LCC) & NPV Engine',
        'Full TSA Engineering Suite (6 Tools)',
        'Full PFP Intumescent Suite (6 Tools)',
        'Dust Collector Capacity & Ventilation Sizing',
        'Multi-member Structural Steel BOQ Take-off',
        'Excel / CSV Stream Export'
      ],
      current: currentPlan === 'Premium',
      cta: 'Choose Premium'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored',
      desc: 'Corporate licensing, team workspaces, and tailored API integrations.',
      features: [
        'Everything in Premium',
        'Unlimited Team Seats & Shared Workspace',
        'Custom Brand Header on PDF Reports',
        'Specification Reading AI Extraction Engine',
        'Dedicated Corrosion Consultant Priority Hotline',
        'SLA & Compliance On-site Auditing'
      ],
      current: currentPlan === 'Enterprise',
      cta: 'Talk To Sales'
    }
  ];

  const handleSelectPlan = (planName) => {
    if (planName === 'Enterprise') {
      window.location.href = 'mailto:info@bgcoating.com?subject=BG%20CoatingOS%20Enterprise%20License';
      return;
    }
    addToast('Plan Updated', `You have switched to the ${planName} plan (Demo).`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full p-6 md:p-8 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#D97706] border border-amber-200/60 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase font-mono tracking-wider">
              <Crown className="w-3.5 h-3.5 text-[#F7941D]" />
              <span>BG CoatingOS™ Subscription Plans</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Upgrade Your Engineering Workspace
            </h2>
            <p className="text-xs text-slate-500">
              Unlock the complete suite of 36+ coating, corrosion, TSA, PFP, and compliance tools.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between relative transition-all duration-200 ${
                plan.popular 
                  ? 'border-[#F7941D] bg-gradient-to-b from-amber-50/30 to-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F7941D] to-[#A41E22] text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 font-mono">{plan.price}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/ {plan.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Includes:</span>
                  <ul className="space-y-1.5">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2 text-[11px] text-slate-700 leading-tight">
                        <Check className="w-3.5 h-3.5 text-[#F7941D] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.name)}
                disabled={plan.current}
                className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  plan.current 
                    ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200' 
                    : plan.popular 
                    ? 'bg-[#F7941D] hover:bg-[#D97706] text-slate-950 shadow-md' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                <span>{plan.cta}</span>
                {!plan.current && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          Need a corporate multi-user license or custom API integration? Contact our technical team at <a href="mailto:info@bgcoating.com" className="text-[#F7941D] font-bold underline">info@bgcoating.com</a>
        </div>

      </div>
    </div>
  );
}
