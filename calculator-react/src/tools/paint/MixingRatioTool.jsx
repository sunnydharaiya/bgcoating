import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcMixingRatio, formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function MixingRatioTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [ratioA, setRatioA] = useState('4');
  const [ratioB, setRatioB] = useState('1');
  const [totalVol, setTotalVol] = useState('');
  const [res, setRes] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sp-mx' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const rA = inp.ratioA ? String(inp.ratioA).replace(/[^\d.]/g, '') : '4';
        const rB = inp.ratioB ? String(inp.ratioB).replace(/[^\d.]/g, '') : '1';
        const v = inp.totalVolume ? String(inp.totalVolume).replace(/[^\d.]/g, '') : '';
        if (rA) setRatioA(rA);
        if (rB) setRatioB(rB);
        if (v) setTotalVol(v);
        if (inp.paintName && inp.paintName !== 'Unspecified') setPaintName(inp.paintName);
        if (rA && rB && v) {
          const computed = calcMixingRatio(rA, rB, v);
          setRes(computed);
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!ratioA || !ratioB || !totalVol) {
      addToast('Missing Required Inputs', 'Please enter Ratio A, Ratio B, and Total Volume.', 'warning');
      return;
    }
    const computed = calcMixingRatio(ratioA, ratioB, totalVol);
    setRes(computed);
    setHasCalculated(true);
    addToast('Calculated Mixing Ratio', 'Volumes of Part A and B computed successfully.', 'success');

    autoLogCalculation({
      tool_id: 'sp-mx',
      tool_name: '2-Component Mixing Ratio',
      category: 'paint',
      inputs: {
        paintName: paintName || 'Unspecified',
        ratioA,
        ratioB,
        totalVolume: `${totalVol} L`,
      },
      results: {
        volumePartA: `${formatNum(computed.volA, 2)} L`,
        volumePartB: `${formatNum(computed.volB, 2)} L`,
        percentPartA: `${Math.round((parseFloat(ratioA) / (parseFloat(ratioA) + parseFloat(ratioB))) * 100)}%`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setPaintName('');
    setRatioA('4');
    setRatioB('1');
    setTotalVol('');
    setRes(null);
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) {
      addToast('No Calculation', 'Please calculate first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Mixing Ratio (P-6)
Paint Name: ${paintName || 'N/A'}
Ratio: ${ratioA} : ${ratioB} | Total Volume: ${totalVol} Litres
--------------------------------------------------
Volume Part A: ${formatNum(res.volA, 2)} L
Volume Part B: ${formatNum(res.volB, 2)} L`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  const pctA = (ratioA && ratioB) ? Math.round((parseFloat(ratioA) / (parseFloat(ratioA) + parseFloat(ratioB))) * 100) : 80;

  return (
    <div className="sub-sec card active" id="sp-mx">
      {/* Card Header (Screenshot 6) */}
      <div className="ch">
        <div className="ci">⚗️</div>
        <div>
          <div className="ct">2-Component Mixing Ratio</div>
          <div className="cs">Calculate Part A (Base) &amp; Part B (Hardener) volumes</div>
        </div>
        <div className="ctag">P-6</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g3">
            <div className="field">
              <label>Part A (Base) <span className="lh">ratio</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-ra-in" 
                  value={ratioA} 
                  onChange={e => { setRatioA(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 4" 
                  min="0.1" 
                  step="0.1" 
                />
              </div>
            </div>

            <div className="field">
              <label>Part B (Hardener) <span className="lh">ratio</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-rb-in" 
                  value={ratioB} 
                  onChange={e => { setRatioB(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 1" 
                  min="0.1" 
                  step="0.1" 
                />
              </div>
            </div>

            <div className="field">
              <label>Total Volume Needed <span className="lh">Litres</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-tot" 
                  value={totalVol} 
                  onChange={e => { setTotalVol(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 20" 
                  min="0.1" 
                />
                <span className="uu">L</span>
              </div>
            </div>
          </div>

          <div className="g1">
            <div className="field">
              <label>Paint Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="mx-nm" 
                  value={paintName} 
                  onChange={e => { setPaintName(e.target.value); }} 
                  placeholder="e.g. Polyurethane Topcoat" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Volumes
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && res && (
          <div className="res" id="r-mx" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Mixing Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Volume Part A</div>
                  <div>
                    <span className="tv" id="mx-ra">{formatNum(res.volA, 2)}</span>
                    <span className="tu">L</span>
                  </div>
                </div>
                <div className="tile ts">
                  <div className="tl">Volume Part B</div>
                  <div>
                    <span className="tv" id="mx-rb">{formatNum(res.volB, 2)}</span>
                    <span className="tu">L</span>
                  </div>
                </div>
              </div>

              {/* Mixing Ratio Visual Bar */}
              <div className="mbar" style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', margin: '14px 0', border: '1px solid var(--bdr)' }}>
                <div className="mba" id="mba" style={{ width: `${pctA}%`, background: 'var(--brand-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  Part A ({pctA}%)
                </div>
                <div className="mbb" id="mbb" style={{ width: `${100 - pctA}%`, background: 'var(--brand-crimson)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  Part B ({100 - pctA}%)
                </div>
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Paint Name</span>
                  <span className="dv" id="mx-rnm">{paintName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Mixing Ratio</span>
                  <span className="dv" id="mx-rr">{ratioA} : {ratioB}</span>
                </div>
                <div className="dr">
                  <span className="dk">Total Volume</span>
                  <span className="dv" id="mx-rt">{totalVol} L</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="action-bar">
                <button type="button" className="btn-print" onClick={handlePrint}>
                  🖨 Print PDF
                </button>
                <button type="button" className="btn-share" onClick={handleShare}>
                  📤 Share Text
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
