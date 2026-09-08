import React, { useState } from 'react';
import { useGuideline } from '../context/GuidelineContext';
import { GUIDELINES_DATA } from '../data/guidelinesData';
import { 
  X, 
  Phone, 
  Globe, 
  Lightbulb,
  Check
} from 'lucide-react';

export default function GuidelineDrawer() {
  const { isOpen, guidelineData, closeGuideline } = useGuideline();
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen || !guidelineData) return null;

  // Resolve guideline object if key string was passed
  let guide = null;
  if (typeof guidelineData === 'string') {
    guide = GUIDELINES_DATA[guidelineData];
  } else if (guidelineData.key && GUIDELINES_DATA[guidelineData.key]) {
    guide = GUIDELINES_DATA[guidelineData.key];
  } else {
    guide = guidelineData;
  }

  // Fallback if not found
  if (!guide) {
    guide = {
      title: guidelineData.title || 'Technical Guideline',
      about: guidelineData.overview || 'Understand each input, how to fill it, why it matters and what values are accepted.',
      f: [],
      out: [],
      tips: guidelineData.rules || [],
      refs: (guidelineData.standards || []).join(' · ')
    };
  }

  const tabs = [
    '1. About This Calculator',
    '2. Input Fields — How to Fill',
    '3. Understanding the Results',
    '4. Tips & Best Practices',
    '5. Reference Standards'
  ];

  return (
    <div 
      className="fixed inset-0 z-[9000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeGuideline();
      }}
    >
      {/* Centered Modal Dialog Box */}
      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-amber-900/10 animate-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="flex items-center gap-3.5 px-5 py-4 border-b border-amber-100 bg-[#FFFDF9]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5911F] to-[#A50021] flex items-center justify-center text-xl shrink-0 shadow-xs text-white">
            📖
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight truncate">
              Guideline: {guide.title || 'Calculator Guide'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 truncate">
              Understand each input, how to fill it, why it matters and what values are accepted.
            </p>
          </div>
          <button
            onClick={closeGuideline}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Sidebar Tabs + Right Scrollable Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-stone-200 bg-[#FBF6EF] p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto">
            {tabs.map((tabLabel, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap md:whitespace-normal cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#FDEBD3] text-[#A34E00] border border-[#F5911F] shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 border border-transparent'
                }`}
              >
                {tabLabel}
              </button>
            ))}

            <div className="hidden md:block mt-auto bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed">
              <Lightbulb className="w-4 h-4 text-blue-600 mb-1" />
              <b>Quick habit:</b> read section 2 once before your first calculation — units and typical ranges are listed beside every field.
            </div>
          </div>

          {/* Right Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-white space-y-4">
            
            {/* TAB 0: About */}
            {activeTab === 0 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[#A50021] border-b-2 border-[#F5911F] pb-1.5">
                  About — {guide.title}
                </div>
                <div className="text-xs text-stone-700 leading-relaxed space-y-3">
                  <p>{guide.about}</p>
                </div>
                <div className="mt-4 p-3.5 bg-[#FFF6E8] border border-[#F2DEC3] border-l-4 border-l-[#F5911F] rounded-xl text-xs text-[#8A5A00] leading-relaxed">
                  <strong>How to use:</strong> Fill the inputs (Section 2 explains each one), review the live calculated metrics, and read the verdict banner first — then the tiles, charts and detail table. Use Print / Export for auditable site QA/QC records.
                </div>
              </div>
            )}

            {/* TAB 1: Input Fields */}
            {activeTab === 1 && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[#A50021] border-b-2 border-[#F5911F] pb-1.5">
                  Input Fields — What, How to Fill, Values &amp; Why
                </div>

                {guide.f && guide.f.length > 0 ? (
                  guide.f.map((fld, idx) => (
                    <div key={idx} className="border border-stone-200 rounded-xl p-3.5 bg-[#FFFDF9] grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8 space-y-1.5">
                        <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#F5911F]/20 text-[#A34E00] text-[10px] font-mono flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {fld[0]}
                        </div>
                        <div className="text-xs text-stone-600">
                          <b>What it is &amp; how to fill:</b> {fld[1]}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 bg-stone-100/70 px-2 py-1 rounded">
                          <b>Values:</b> {fld[2]}
                        </div>
                      </div>

                      <div className={`sm:col-span-4 rounded-lg p-2.5 text-[11px] leading-relaxed ${
                        idx % 4 === 0 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60' :
                        idx % 4 === 1 ? 'bg-purple-50 text-purple-900 border border-purple-200/60' :
                        idx % 4 === 2 ? 'bg-blue-50 text-blue-900 border border-blue-200/60' :
                        'bg-amber-50 text-amber-900 border border-amber-200/60'
                      }`}>
                        <b className="block uppercase text-[9px] tracking-wider mb-0.5">Why it matters:</b>
                        {fld[3]}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-stone-50 rounded-xl text-stone-500 text-center text-xs">
                    Standard engineering parameters apply. See About tab for details.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Understanding Results */}
            {activeTab === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[#A50021] border-b-2 border-[#F5911F] pb-1.5">
                  Understanding the Results &amp; Thresholds
                </div>

                {guide.out && guide.out.length > 0 ? (
                  guide.out.map((res, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 py-2 border-b border-dashed border-stone-200 text-xs">
                      <div className="w-full sm:w-48 font-bold text-[#A34E00] shrink-0 font-mono">
                        {res[0]}
                      </div>
                      <div className="text-stone-600 leading-relaxed">
                        {res[1]}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-stone-50 rounded-xl text-stone-500 text-center text-xs">
                    Results auto-calculate live per mathematical formulas.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Tips & Best Practices */}
            {activeTab === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[#A50021] border-b-2 border-[#F5911F] pb-1.5">
                  Tips &amp; Best Practices
                </div>

                {guide.tips && guide.tips.length > 0 ? (
                  guide.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 py-1 text-xs text-stone-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-stone-50 rounded-xl text-stone-500 text-center text-xs">
                    Always inspect environmental conditions (ambient, surface temp, relative humidity, dew point) before painting.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Reference Standards */}
            {activeTab === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[#A50021] border-b-2 border-[#F5911F] pb-1.5">
                  Reference Standards
                </div>

                <div className="text-xs font-mono font-bold text-[#2B1A12] bg-[#FBF6EF] border border-stone-200 p-3.5 rounded-xl leading-relaxed">
                  {guide.refs || 'ISO 12944 · SSPC-PA 2 · ASTM D4417 · AMPP Specifications'}
                </div>

                <div className="text-xs text-stone-500 leading-relaxed">
                  These standards are referenced for engineering guidance. Always follow the project specification and the manufacturer’s certified technical data sheets where they differ. This guideline is provided for reference within the workspace.
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-stone-200 bg-[#FFF6E8] text-xs text-[#8A5A00]">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span>⚠️ Need help? Contact BG Group Coating Consultants</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-[#F5911F]" /> +91 99258 10408
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Globe className="w-3 h-3 text-[#F5911F]" /> bgcoating.com
            </span>
          </div>

          <button
            onClick={closeGuideline}
            className="w-full sm:w-auto bg-white border border-[#D8C6B2] hover:bg-stone-50 text-stone-800 font-bold px-6 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
