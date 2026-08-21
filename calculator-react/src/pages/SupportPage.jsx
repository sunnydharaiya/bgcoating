import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    { q: 'How is application loss factor % calculated in BG CoatingOS?', a: 'Loss factor accounts for overspray, wind conditions, surface roughness profile absorption, and paint can residue (typically 20-35% for airless spray).' },
    { q: 'What is the difference between Garnet and Copper Slag blasting consumption?', a: 'Garnet is a denser, reusable mineral abrasive requiring ~18 kg/m², whereas Copper Slag is a single-use synthetic abrasive requiring ~30 kg/m².' },
    { q: 'How do I save calculation projects across sessions?', a: 'Sign in to your consultant account in the top header rail to store saved projects and audit logs directly in your BG Group account.' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 flex items-center gap-4">
        <div className="bg-[#F7941D]/20 text-[#F7941D] p-3 rounded-xl">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">FAQ & Consultant Help Desk</h2>
          <p className="text-xs text-slate-400">Technical support, estimation guidance, and NACE Level 3 consultancy help.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#F7941D]" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Technical Hotline</span>
            <strong className="text-xs text-white">+91-99258-10408</strong>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center gap-3">
          <Mail className="w-5 h-5 text-sky-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Email Support</span>
            <strong className="text-xs text-white">support@bgcoating.com</strong>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">WhatsApp Technical Team</span>
            <strong className="text-xs text-white">+91-99258-10408</strong>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 space-y-1">
              <h4 className="text-xs font-bold text-[#F7941D]">{f.q}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
