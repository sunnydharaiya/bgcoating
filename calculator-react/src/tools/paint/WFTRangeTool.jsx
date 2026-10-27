import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcWFTRange, formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function WFTRangeTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [minDft, setMinDft] = useState('');
  const [maxDft, setMaxDft] = useState('');
  const [vs, setVs] = useState('');
  const [thinner, setThinner] = useState('0');
  const [res, setRes] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sp-pc' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const dMin = inp.minDft ? String(inp.minDft).replace(/[^\d.]/g, '') : '';
        const dMax = inp.maxDft ? String(inp.maxDft).replace(/[^\d.]/g, '') : '';
        const v = inp.vsPercent ? String(inp.vsPercent).replace(/[^\d.]/g, '') : '';
        const th = inp.thinnerPercent ? String(inp.thinnerPercent).replace(/[^\d.]/g, '') : '0';
        if (dMin) setMinDft(dMin);
        if (dMax) setMaxDft(dMax);
        if (v) setVs(v);
        if (th) setThinner(th);
        if (inp.paintName && inp.paintName !== 'Unspecified') setPaintName(inp.paintName);
        if (dMin && dMax && v) {
          const computed = calcWFTRange(dMin, dMax, v, th || 0);
          setRes(computed);
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!minDft || !maxDft || !vs) {
      addToast('Missing Required Inputs', 'Please enter Min DFT, Max DFT, and Volume Solids.', 'warning');
      return;
    }
    const computed = calcWFTRange(minDft, maxDft, vs, thinner || 0);
    setRes(computed);
    setHasCalculated(true);
    addToast('Calculated WFT Range', 'WFT targets computed successfully.', 'success');

    // Auto-log to history & database
    autoLogCalculation({
      tool_id: 'sp-pc',
      tool_name: 'WFT Range Calculation',
      category: 'paint',
      inputs: {
        paintName: paintName || 'Unspecified',
        minDft: `${minDft} µm`,
        maxDft: `${maxDft} µm`,
        vsPercent: `${vs}%`,
        thinnerPercent: `${thinner || 0}%`,
      },
      results: {
        minWft: `${formatNum(computed.minWft, 0)} µm`,
        maxWft: `${formatNum(computed.maxWft, 0)} µm`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setPaintName('');
    setMinDft('');
    setMaxDft('');
    setVs('');
    setThinner('0');
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
    const text = `BG CoatingOS™ — WFT Range Calculation (P-1)
Paint Name: ${paintName || 'N/A'}
Volume Solids: ${vs}% | Thinner: ${thinner}%
Specified DFT: ${minDft} - ${maxDft} µm
--------------------------------------------------
Target WFT Range: ${formatNum(res.minWft, 0)} - ${formatNum(res.maxWft, 0)} µm`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-pc">
      {/* Card Header (Screenshot 2) */}
      <div className="ch">
        <div className="ci">🧮</div>
        <div>
          <div className="ct">WFT Range Calculation</div>
          <div className="cs">Min &amp; Max WFT from DFT range</div>
        </div>
        <div className="ctag">P-1</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Min DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pc-dmin" 
                  value={minDft} 
                  onChange={e => { setMinDft(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 100" 
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Max DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pc-dmax" 
                  value={maxDft} 
                  onChange={e => { setMaxDft(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 150" 
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Volume Solids <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pc-vs" 
                  value={vs} 
                  onChange={e => { setVs(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 75" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Thinner <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pc-th" 
                  value={thinner} 
                  onChange={e => { setThinner(e.target.value); setHasCalculated(false); }} 
                  placeholder="0" 
                  min="0" 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Paint Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                id="pc-nm" 
                value={paintName} 
                onChange={e => setPaintName(e.target.value)} 
                placeholder="e.g. Inorganic Zinc Silicate" 
              />
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate WFT Range
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && res && (
          <div className="res" id="r-pc" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>WFT Range Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">WFT Minimum</div>
                  <div>
                    <span className="tv" id="pc-rmin">{formatNum(res.minWft, 0)}</span>
                    <span className="tu">µm</span>
                  </div>
                  <div className="tn">From Min DFT</div>
                </div>

                <div className="tile ts">
                  <div className="tl">WFT Maximum</div>
                  <div>
                    <span className="tv" id="pc-rmax">{formatNum(res.maxWft, 0)}</span>
                    <span className="tu">µm</span>
                  </div>
                  <div className="tn">From Max DFT</div>
                </div>
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Paint Name</span>
                  <span className="dv" id="pc-rnm">{paintName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Min DFT</span>
                  <span className="dv" id="pc-rdmin">{minDft ? `${minDft} µm` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Max DFT</span>
                  <span className="dv" id="pc-rdmax">{maxDft ? `${maxDft} µm` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Volume Solids</span>
                  <span className="dv" id="pc-rvs">{vs ? `${vs}%` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Thinner Added</span>
                  <span className="dv" id="pc-rth">{thinner}%</span>
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
