const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'tools', 'pro', 'VolumeSolidsSuite.jsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = \          {/* Form Inputs Grid */}
          <div className="relative border-2 border-[#F7941D]/30 rounded-xl p-5 md:p-6 pt-7 md:pt-8 mt-4">
            
            {/* Badge Overlapping Border */}
            <div className="absolute -top-3 left-4 md:left-6 bg-gradient-to-r from-[#FBA435] to-[#F7941D] text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-3 h-3" />
              USER INPUTS — PLEASE FILL CORRECTLY
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* DFT (from TDS) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-[#F7941D] uppercase tracking-wider">DFT (FROM TDS)</label>
                  <span className="text-[10px] text-[#F7941D] font-mono">µm</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={vstDft}
                    onChange={e => setVstDft(e.target.value)}
                    placeholder="e.g. 125"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F7941D] pointer-events-none">µm</div>
                </div>
              </div>

              {/* Theoretical Coverage */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-[#F7941D] uppercase tracking-wider">THEORETICAL COVERAGE</label>
                  <span className="text-[10px] text-[#F7941D] font-mono">m²/L</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={vstCov}
                    onChange={e => setVstCov(e.target.value)}
                    placeholder="e.g. 5.6"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F7941D] pointer-events-none">m²/L</div>
                </div>
              </div>

              {/* Published Volume Solids */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-[#F7941D] uppercase tracking-wider">PUBLISHED VOLUME SOLIDS</label>
                  <span className="text-[10px] text-[#F7941D] font-mono">% - optional</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={vstPub}
                    onChange={e => setVstPub(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F7941D] pointer-events-none">%</div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-[#F7941D] uppercase tracking-wider">PRODUCT NAME</label>
                  <span className="text-[10px] text-slate-400 font-mono lowercase">optional</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={vstNm}
                    onChange={e => setVstNm(e.target.value)}
                    placeholder="e.g. High-Build Epoxy"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  />
                </div>
              </div>

            </div>

            {/* Formula Callout Banner */}
            <div className="mt-5 p-3.5 bg-[#FFF4E3] rounded-xl text-xs text-stone-700 leading-relaxed font-mono border border-[#F7941D]/20">
              <strong className="text-[#D97706]">Formula:</strong> Volume Solids (%) = ( DFT * Theoretical Coverage ) / 10 &nbsp;-&nbsp; Example: 125 µm * 5.6 m²/L / 10 = <strong>70%</strong>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-4">
            <button
              type="button"
              onClick={() => handleCalculate('tds')}
              className="flex-[2] md:flex-[3] py-3.5 bg-gradient-to-r from-[#FBA435] to-[#F7941D] hover:from-[#F7941D] hover:to-[#E8700A] text-white font-bold text-sm md:text-base rounded-full shadow-[0_2px_8px_rgba(247,148,29,0.3)] transition hover:shadow-[0_4px_12px_rgba(247,148,29,0.4)] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Verify Volume Solids</span>
            </button>
            <button
              type="button"
              onClick={() => handleReset('tds')}
              className="flex-1 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm md:text-base rounded-full shadow-sm transition hover:bg-slate-50 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
          </div>\;

const startIdx = content.indexOf('{/* Form Inputs Grid */}');
const endIdx = content.indexOf('{/* Results Output Section */}');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacement + '\n          ' + content.substring(endIdx);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated VolumeSolidsSuite.jsx');
} else {
  console.log('Markers not found');
}
