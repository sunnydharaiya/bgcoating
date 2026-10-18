// src/tools/inspection/InspectionStandardsReference.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  SlidersHorizontal, 
  Layers, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';

const STANDARDS_LIST = [
  { code: 'ISO 8501-1', title: 'Preparation of Steel Substrates — Visual Assessment of Surface Cleanliness', cat: 'Surface Prep', scope: 'Rust grades A, B, C, D and blast-cleaning grades Sa 1, Sa 2, Sa 2½, Sa 3, St 2, St 3' },
  { code: 'ISO 8502-3', title: 'Assessment of Dust on Steel Surfaces Prepared for Painting (Pressure-Sensitive Tape)', cat: 'Surface Prep', scope: 'Dust particle quantity ratings 0 to 5 and dust class sizes 1 to 5' },
  { code: 'ISO 8502-4', title: 'Guidance on the Estimation of Probability of Condensation Prior to Paint Application', cat: 'Environmental', scope: 'Dew Point calculation and minimum 3°C steel temperature margin rule' },
  { code: 'ISO 8502-6', title: 'Extraction of Soluble Contaminants for Analysis — Bresle Method', cat: 'Soluble Salts', scope: 'Sampling of water-soluble chlorides, sulfates and nitrates via flexible Bresle cell' },
  { code: 'ISO 8502-9', title: 'Field Conductometric Method for the Determination of Water-Soluble Salts', cat: 'Soluble Salts', scope: 'Direct conductivity measurement and conversion to mg/m² equivalent NaCl / chloride' },
  { code: 'ISO 8503-1/2', title: 'Surface Roughness Characteristics of Blast-Cleaned Substrates — Comparators', cat: 'Profile', scope: 'Grit and Shot surface profile comparators for Fine, Medium, Coarse grading' },
  { code: 'ISO 19840', title: 'Measurement of, and Acceptance Criteria for, the Thickness of Dry Films on Rough Surfaces', cat: 'Film Thickness', scope: '90/10 and 80/20 criteria, surface profile correction factors for blast-cleaned steel' },
  { code: 'ISO 4624', title: 'Paints and Varnishes — Pull-Off Test for Adhesion', cat: 'Adhesion', scope: 'Tensile adhesion testing of single-coat and multi-coat systems using rigid dollies' },
  { code: 'ISO 2409', title: 'Paints and Varnishes — Cross-Cut Test', cat: 'Adhesion', scope: 'Cross-hatch lattice cutting test for coatings up to 250 µm with ratings from Class 0 to 5' },
  { code: 'SSPC-PA 2', title: 'Procedure for Determining Conformance to Dry Coating Thickness Requirements', cat: 'Film Thickness', scope: 'Level 1 to Level 5 restriction bounds, spot measurement frequency per area bracket' },
  { code: 'SSPC-SP 10', title: 'Near-White Blast Cleaning (NACE No. 2 / AMPP SP 10)', cat: 'Surface Prep', scope: 'Near-white metal requirement: maximum 5% random shadows/streaks per unit area' },
  { code: 'ASTM D4417', title: 'Field Measurement of Surface Profile of Blast Cleaned Steel', cat: 'Profile', scope: 'Method A (visual), Method B (depth micrometer gauge), Method C (replica tape)' },
  { code: 'ASTM D4414', title: 'Measurement of Wet Film Thickness by Notch Gages', cat: 'Film Thickness', scope: 'Standard comb / notch gauge measurement during wet paint application' },
  { code: 'ASTM D7091', title: 'Nondestructive Measurement of Dry Film Thickness of Applied Organic Coatings', cat: 'Film Thickness', scope: 'Calibration, verification, and measurement using magnetic and eddy current gauges' },
  { code: 'ASTM D4541', title: 'Pull-Off Strength of Coatings Using Portable Adhesion Testers', cat: 'Adhesion', scope: 'Test methods Type II (fixed alignment), Type III (hydraulic), Type IV/V (pneumatic/auto)' },
  { code: 'ASTM D3359', title: 'Measuring Adhesion by Tape Test', cat: 'Adhesion', scope: 'Method A (X-cut for films > 125 µm), Method B (Cross-cut lattice for films ≤ 125 µm)' },
  { code: 'NACE SP0188', title: 'Discontinuity (Holiday) Testing of New Protective Coatings on Conductive Substrates', cat: 'Continuity', scope: 'Low-voltage wet sponge (up to 500 µm) and high-voltage spark testing for pinholes' },
  { code: 'ASTM D4752', title: 'Measuring MEK Resistance of Ethyl Silicate (Inorganic) Zinc-Rich Primers by Solvent Rub', cat: 'Curing', scope: '50 double rubs with methyl ethyl ketone (MEK) to evaluate primer silicate cure' }
];

export default function InspectionStandardsReference({ 
  initialTab = 'std',
  onTabChange 
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'std');
  const [search, setSearch] = useState('');

  // Sync activeTab whenever initialTab prop changes
  useEffect(() => {
    if (initialTab && (initialTab === 'std' || initialTab === 'refp' || initialTab === 'refc')) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const filteredStandards = STANDARDS_LIST.filter(s => 
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* Tab Selector */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-slate-900">
            QA/QC Engineering Standards &amp; Classification Matrix
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {[
            { id: 'std', label: 'Standards Library' },
            { id: 'refp', label: 'Pull-Off Adhesion Guide' },
            { id: 'refc', label: 'Cross-Cut Matrix' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: STANDARDS LIBRARY */}
      {activeTab === 'std' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Coating Inspection &amp; Testing Standards Matrix (ISO, ASTM, SSPC, NACE)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official normative reference list for protective coating quality control specifications.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search standard code / title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/60"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-36">Standard Code</th>
                  <th className="py-2.5 px-3 w-28">Category</th>
                  <th className="py-2.5 px-3 w-72">Standard Title</th>
                  <th className="py-2.5 px-3">Industrial Scope &amp; Acceptance Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStandards.map((std, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700 bg-amber-50/20">
                      {std.code}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {std.cat}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {std.title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 leading-relaxed">
                      {std.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PULL-OFF ADHESION FAILURE MODES GUIDE */}
      {activeTab === 'refp' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ASTM D4541 / ISO 4624 Tensile Pull-Off Failure Mode Classification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When reporting pull-off adhesion, failure must be described in terms of percentage of area and location of fracture within the multi-coat system:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {[
                { code: 'A', title: 'Substrate Cohesive Failure', desc: 'Fracture occurs within the substrate material itself (e.g. concrete / composite spalling).' },
                { code: 'A/B', title: 'Substrate-to-Primer Adhesive', desc: 'Adhesion loss between steel substrate (A) and 1st primer coat (B). Indicates poor anchor profile or oil/salt contamination.' },
                { code: 'B', title: 'Primer Cohesive Failure', desc: 'Tensile fracture occurs completely within the primer layer (e.g. Zinc silicate cohesive shear).' },
                { code: 'B/C', title: 'Primer-to-Intermediate Adhesive', desc: 'Inter-coat adhesion failure between primer (B) and intermediate coat (C). Exceeded maximum overcoating window.' },
                { code: 'C', title: 'Intermediate Cohesive Failure', desc: 'Fracture within the body of high-build epoxy intermediate coat.' },
                { code: 'C/D', title: 'Intermediate-to-Topcoat Adhesive', desc: 'Adhesion failure between epoxy intermediate (C) and polyurethane topcoat (D). Amine sweating/blushing.' },
                { code: 'D', title: 'Topcoat Cohesive Failure', desc: 'Fracture within the polyurethane finish topcoat layer.' },
                { code: 'Y/Z', title: 'Glue / Adhesive Failure', desc: 'Failure of glue bond to dolly (Y/Z) or coating (Y). If > 50% glue failure, test is invalid and must be re-performed.' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      Notation: {item.code}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CROSS-CUT ADHESION CLASSIFICATION MATRIX */}
      {activeTab === 'refc' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-600" />
            ASTM D3359 Method B vs. ISO 2409 Classification Matrix
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-32 text-center">ASTM D3359</th>
                  <th className="py-2.5 px-3 w-28 text-center">ISO 2409</th>
                  <th className="py-2.5 px-3 w-32 text-center">Flaked Area</th>
                  <th className="py-2.5 px-3">Visual Lattice Surface Description</th>
                  <th className="py-2.5 px-3 w-28 text-center">Standard Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  { astm: 'Classification 5B', iso: 'Class 0', pct: '0% Flaking', desc: 'The edges of the cuts are completely smooth; none of the squares of the lattice is detached.', pass: true },
                  { astm: 'Classification 4B', iso: 'Class 1', pct: '< 5% Flaking', desc: 'Small flakes of the coating are detached at intersections; less than 5% of the lattice area affected.', pass: true },
                  { astm: 'Classification 3B', iso: 'Class 2', pct: '5 – 15% Flaking', desc: 'Small flakes of the coating are detached along edges and intersections; 5% to 15% affected.', pass: false },
                  { astm: 'Classification 2B', iso: 'Class 3', pct: '15 – 35% Flaking', desc: 'The coating has flaked along the edges and on parts of the squares; 15% to 35% affected.', pass: false },
                  { astm: 'Classification 1B', iso: 'Class 4', pct: '35 – 65% Flaking', desc: 'The coating has flaked along the edges in large ribbons and whole squares detached; 35% to 65%.', pass: false },
                  { astm: 'Classification 0B', iso: 'Class 5', pct: '> 65% Flaking', desc: 'Any degree of flaking that cannot even be classified by classification 1B; greater than 65%.', pass: false }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-violet-700 bg-violet-50/30">
                      {row.astm}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {row.iso}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                      {row.pct}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 leading-relaxed">
                      {row.desc}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        row.pass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.pass ? 'ACCEPTABLE' : 'REJECTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
