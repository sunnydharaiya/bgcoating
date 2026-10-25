import React from 'react';
import { ABRASIVE_MAP, INSP_CATALOG, INSP_STANDARD_SET } from '../../data/blasterDatabase';

export default function BlasterProcess({
  state,
  onChange,
  metrics,
  onNavigate,
  onOpenCatalog,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    evaluatedEnvRows = [],
    dbAvg = '—',
    wbAvg = '—',
    mtAvg = '—',
    rhAvg = '—',
    dpAvg = '—',
    diffAvg = '—',
    envFinalOK = false,
    profAvg = '—',
    profVerdictText = '—',
    inspPass = 0,
    inspFail = 0,
    inspNa = 0,
    inspPct = 0
  } = metrics || {};

  // Environmental Row Management
  const handleAddEnvRow = () => {
    const rows = state.envRows || [];
    const lastTime = rows[rows.length - 1]?.time || '1000';
    const nextHour = (parseInt(lastTime.slice(0, 2), 10) || 10) + 1;
    const newTime = `${nextHour.toString().padStart(2, '0')}00`;
    onChange('envRows', [...rows, { time: newTime, db: '', wb: '', mt: '' }]);
  };

  const handleClearEnvRows = () => {
    if (window.confirm('Clear all environmental timing rows?')) {
      onChange('envRows', []);
    }
  };

  const handleRemoveEnvRow = (index) => {
    const rows = state.envRows || [];
    onChange('envRows', rows.filter((_, i) => i !== index));
  };

  const handleEnvRowChange = (index, field, value) => {
    const rows = [...(state.envRows || [])];
    if (!rows[index]) rows[index] = { time: '', db: '', wb: '', mt: '' };
    rows[index] = { ...rows[index], [field]: value };
    onChange('envRows', rows);
  };

  // Surface Profile Spot Management
  const handleProfileSpotChange = (index, value) => {
    const spots = [...(state.profileSpots || [0, 0, 0, 0, 0])];
    spots[index] = parseFloat(value) || 0;
    onChange('profileSpots', spots);
  };

  // Abrasive Type Selection (Autofills class and standards)
  const handleAbrasiveTypeChange = (type) => {
    onChange('abType', type);
    const map = ABRASIVE_MAP[type];
    if (map) {
      onChange('abClass', map.cls);
      onChange('abSspc', map.sspc);
      onChange('abIso', map.iso);
    }
  };

  // Inspection Row Management
  const handleInspRowChange = (index, field, value) => {
    const rows = [...(state.inspRows || [])];
    if (!rows[index]) rows[index] = { p: '', std: '', req: '', obs: '', res: '' };
    rows[index] = { ...rows[index], [field]: value };
    onChange('inspRows', rows);
  };

  const handleRemoveInspRow = (index) => {
    const rows = state.inspRows || [];
    onChange('inspRows', rows.filter((_, i) => i !== index));
  };

  const handleClearInspRows = () => {
    if (window.confirm('Clear all inspection rows?')) {
      onChange('inspRows', []);
    }
  };

  const handleAddStandard5Set = () => {
    const stdRows = INSP_STANDARD_SET.map(idx => {
      const cat = INSP_CATALOG[idx];
      return {
        p: cat.t,
        std: cat.std,
        req: cat.req,
        obs: 'Conforms to specification',
        res: 'Pass'
      };
    });
    onChange('inspRows', stdRows);
  };

  const handleAddBlankInspRow = () => {
    const rows = state.inspRows || [];
    onChange('inspRows', [
      ...rows,
      { p: '', std: '', req: '', obs: '', res: '' }
    ]);
  };

  const profileSpots = state.profileSpots || [0, 0, 0, 0, 0];

  return (
    <div className="sheet act" id="sh-blasting">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">BLASTING PROCESS</div>
          <div className="xl-corp-s">Environmental Monitoring · Surface Preparation &amp; Abrasive · Inspection Summary — combined process sheet</div>
        </div>
      </div>

      {/* SECTION 0: TEST PANEL INFORMATION */}
      <div className="xl-sec-h" id="sec-blasting-0"><span className="ic">📍</span>Test Panel Information</div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">Item No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="env-item-no"
              value={state.envItemNo || '1'}
              onChange={(e) => onChange('envItemNo', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Item Prepared</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="env-item"
              placeholder="e.g. Test panel as per ASTM D 4228"
              value={state.envItem || ''}
              onChange={(e) => onChange('envItem', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Cond. Ref.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="env-cond"
              placeholder="A"
              value={state.envCond || 'A'}
              onChange={(e) => onChange('envCond', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">RH Limit</div>
          <div className="xl-cell-v">
            <input
              type="number"
              id="env-rh-limit"
              value={state.envRhLimit ?? 85}
              min="0"
              max="100"
              onChange={(e) => onChange('envRhLimit', parseFloat(e.target.value) || 85)}
              title="RH must be ≤ this value"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: ENVIRONMENTAL READINGS */}
      <div className="xl-sec-h" id="sec-blasting-1">
        <span className="ic">🌡️</span>Environmental Readings
        <span className="num">AUTO-CALC: RH, DP, MT−DP, VERDICT</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '9px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-add" onClick={handleAddEnvRow}>＋ Add Timing Row</button>
        <button type="button" className="btn btn-reset" onClick={handleClearEnvRows}>↺ Clear Rows</button>
        <span style={{ fontSize: '11px', color: 'var(--txt2)', marginLeft: 'auto' }}>
          Pass criteria: RH ≤ <b id="env-rh-disp">{state.envRhLimit ?? 85}</b>% &nbsp;·&nbsp; Steel − DP ≥ <b>3°C</b>
        </span>
      </div>

      <div className="xl-tbl-w">
        <table className="xl-tbl env-tbl">
          <thead>
            <tr>
              <th style={{ width: '36px' }}>#</th>
              <th style={{ width: '90px' }}>Time (HRS)</th>
              <th>Dry Bulb (°C)</th>
              <th>Wet Bulb (°C)</th>
              <th>Steel Temp (°C)</th>
              <th>RH (%)</th>
              <th>Dew Pt (°C)</th>
              <th>MT − DP (°C)</th>
              <th>Verdict</th>
              <th style={{ width: '42px' }}>×</th>
            </tr>
          </thead>
          <tbody id="env-tbody">
            {evaluatedEnvRows.map((r, i) => (
              <tr key={i} data-id={i + 1}>
                <td><b>{i + 1}</b></td>
                <td>
                  <input
                    type="text"
                    className="env-time"
                    placeholder="HHMM"
                    value={r.time || ''}
                    onChange={(e) => handleEnvRowChange(i, 'time', e.target.value)}
                    style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    className="env-db"
                    value={r.db ?? ''}
                    onChange={(e) => handleEnvRowChange(i, 'db', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    className="env-wb"
                    value={r.wb ?? ''}
                    onChange={(e) => handleEnvRowChange(i, 'wb', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    className="env-mt"
                    value={r.mt ?? ''}
                    onChange={(e) => handleEnvRowChange(i, 'mt', e.target.value)}
                  />
                </td>
                <td className="calc env-rh">{r.rh ?? '—'}</td>
                <td className="calc env-dp">{r.dp ?? '—'}</td>
                <td className="calc env-diff">{r.diff ?? '—'}</td>
                <td className={`env-v ${r.ok ? 'ok-cell' : r.rh !== '—' ? 'nok-cell' : ''}`}>
                  {r.rh === '—' ? '—' : r.ok ? 'OK' : 'FAIL'}
                </td>
                <td>
                  <button
                    type="button"
                    className="rep-act del"
                    title="Remove this row"
                    onClick={() => handleRemoveEnvRow(i)}
                    style={{ width: '24px', height: '24px' }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'linear-gradient(180deg,#F4E5C7,#E9D7B0)', fontWeight: 700 }}>
              <td colSpan="2" style={{ textAlign: 'right', fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', fontSize: '12px', paddingRight: '10px' }}>AVERAGE</td>
              <td className="calc" id="env-db-avg">{dbAvg}</td>
              <td className="calc" id="env-wb-avg">{wbAvg}</td>
              <td className="calc" id="env-mt-avg">{mtAvg}</td>
              <td className="calc" id="env-rh-avg">{rhAvg}</td>
              <td className="calc" id="env-dp-avg">{dpAvg}</td>
              <td className="calc" id="env-diff-avg">{diffAvg}</td>
              <td id="env-v-final" className={envFinalOK ? 'ok-cell' : 'nok-cell'}>
                {envFinalOK ? 'ACCEPTABLE' : 'UNACCEPTABLE'}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* SECTION 2: SURFACE PREPARATION */}
      <div className="xl-sec-h" id="sec-blasting-2"><span className="ic">⚙️</span>Surface Preparation</div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">Method</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-method"
              list="dl-sp-method"
              placeholder="e.g. Abrasive Blasting"
              value={state.spMethod || ''}
              onChange={(e) => onChange('spMethod', e.target.value)}
            />
            <datalist id="dl-sp-method">
              <option value="Abrasive Blasting"></option>
              <option value="Power Tool Cleaning"></option>
              <option value="Hand Tool Cleaning"></option>
              <option value="Wet Abrasive Blasting"></option>
              <option value="UHP Water Jetting"></option>
              <option value="Vacuum Blasting"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Prep. Ref.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-ref"
              placeholder="e.g. ITEM 01"
              value={state.spRef || ''}
              onChange={(e) => onChange('spRef', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Cond. Ref.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-cond"
              placeholder="A"
              value={state.spCond || 'A'}
              onChange={(e) => onChange('spCond', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Start Time</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-start"
              placeholder="e.g. 1145 HRS"
              value={state.spStart || ''}
              onChange={(e) => onChange('spStart', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Required Std.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-std-req"
              list="dl-sp-std"
              placeholder="e.g. SA 2.5"
              value={state.spStdReq || ''}
              onChange={(e) => onChange('spStdReq', e.target.value)}
            />
            <datalist id="dl-sp-std">
              <option value="SA 1"></option>
              <option value="SA 2"></option>
              <option value="SA 2.5"></option>
              <option value="SA 3"></option>
              <option value="St 2"></option>
              <option value="St 3"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Actual Std.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-std-act"
              list="dl-sp-std"
              placeholder="e.g. SA 2.5"
              value={state.spStdAct || ''}
              onChange={(e) => onChange('spStdAct', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Profile Req. (µm)</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-prof-req"
              placeholder="e.g. 50-75 µm"
              value={state.spProfReq || ''}
              onChange={(e) => onChange('spProfReq', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">End Time</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="sp-end"
              placeholder="e.g. 1215 HRS"
              value={state.spEnd || ''}
              onChange={(e) => onChange('spEnd', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: SURFACE PROFILE READINGS */}
      <div className="xl-sec-h" id="sec-blasting-3">
        <span className="ic">📏</span>Surface Profile Readings (Replica Tape / Stylus)
      </div>
      <div className="xl-tbl-w">
        <table className="xl-tbl">
          <thead>
            <tr>
              <th>Reading 1 (µm)</th>
              <th>Reading 2 (µm)</th>
              <th>Reading 3 (µm)</th>
              <th>Reading 4 (µm)</th>
              <th>Reading 5 (µm)</th>
              <th>Average (µm)</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[0, 1, 2, 3, 4].map((idx) => (
                <td key={idx}>
                  <input
                    type="number"
                    id={`prof-${idx}`}
                    value={profileSpots[idx] || ''}
                    placeholder=""
                    onChange={(e) => handleProfileSpotChange(idx, e.target.value)}
                  />
                </td>
              ))}
              <td id="prof-avg" style={{ background: 'var(--bg4)', fontWeight: 700, color: 'var(--o1)', fontFamily: 'Rajdhani,sans-serif', fontSize: '14px' }}>
                {profAvg}
              </td>
              <td id="prof-verdict" className={profVerdictText === 'Pass' ? 'ok-cell' : profVerdictText === 'Fail' ? 'nok-cell' : ''}>
                {profVerdictText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 4: ABRASIVE INFORMATION */}
      <div className="xl-sec-h" id="sec-blasting-4"><span className="ic">🪨</span>Abrasive Information</div>
      <div className="xl-info">
        <div className="xl-cell">
          <div className="xl-cell-l">Abrasive Type</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-type"
              list="dl-ab-type"
              placeholder="e.g. Copper Slag / Garnet"
              value={state.abType || ''}
              onChange={(e) => handleAbrasiveTypeChange(e.target.value)}
            />
            <datalist id="dl-ab-type">
              <option value="Copper Slag"></option>
              <option value="Steel Grit / Shot"></option>
              <option value="Garnet"></option>
              <option value="Aluminum Oxide"></option>
              <option value="Silica Sand"></option>
              <option value="Other"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Material Class</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-class"
              list="dl-ab-class"
              placeholder="e.g. Mineral / Slag"
              value={state.abClass || ''}
              onChange={(e) => onChange('abClass', e.target.value)}
            />
            <datalist id="dl-ab-class">
              <option value="Mineral / Slag"></option>
              <option value="Mineral Abrasive"></option>
              <option value="Metallic Abrasive"></option>
              <option value="Synthetic Abrasive"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">SSPC Standard</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-sspc"
              list="dl-ab-sspc"
              placeholder="e.g. SSPC-AB 1"
              value={state.abSspc || ''}
              onChange={(e) => onChange('abSspc', e.target.value)}
            />
            <datalist id="dl-ab-sspc">
              <option value="SSPC-AB 1"></option>
              <option value="SSPC-AB 2"></option>
              <option value="SSPC-AB 3"></option>
              <option value="SSPC-AB 4"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">ISO Standard</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-iso"
              list="dl-ab-iso"
              placeholder="e.g. ISO 11126-3"
              value={state.abIso || ''}
              onChange={(e) => onChange('abIso', e.target.value)}
            />
            <datalist id="dl-ab-iso">
              <option value="ISO 11126-3"></option>
              <option value="ISO 11126-4"></option>
              <option value="ISO 11126-7"></option>
              <option value="ISO 11126-10"></option>
              <option value="ISO 11124-1"></option>
              <option value="ISO 11124-2"></option>
              <option value="ISO 11124-3"></option>
              <option value="ISO 11124-4"></option>
            </datalist>
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Mesh Size</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-mesh"
              placeholder="e.g. G14 / G18"
              value={state.abMesh || ''}
              onChange={(e) => onChange('abMesh', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Manufacturer</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input
              type="text"
              id="ab-mfr"
              placeholder="Abrasive manufacturer"
              value={state.abMfr || ''}
              onChange={(e) => onChange('abMfr', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Batch / Lot No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-batch"
              placeholder="Batch / lot reference"
              value={state.abBatch || ''}
              onChange={(e) => onChange('abBatch', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">TC / MTC Ref.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id="ab-tc"
              placeholder="Test Certificate Ref."
              value={state.abTc || ''}
              onChange={(e) => onChange('abTc', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Date Received</div>
          <div className="xl-cell-v">
            <input
              type="date"
              id="ab-date"
              value={state.abDate || ''}
              onChange={(e) => onChange('abDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: INSPECTION SUMMARY · PROCESS TEST RESULTS */}
      <div className="xl-sec-h" style={{ marginTop: '18px' }} id="sec-blasting-5">
        <span className="ic">🧪</span>Inspection Summary · Process Test Results
      </div>

      <div className="compl-bar">
        <div className="compl-item"><div className="compl-dot g"></div><span className="compl-lbl">Pass:</span><span className="compl-val" id="insp-pass">{inspPass}</span></div>
        <div className="compl-item"><div className="compl-dot r"></div><span className="compl-lbl">Fail:</span><span className="compl-val" id="insp-fail">{inspFail}</span></div>
        <div className="compl-item"><div className="compl-dot y"></div><span className="compl-lbl">N.A.:</span><span className="compl-val" id="insp-na">{inspNa}</span></div>
        <div className="compl-pct" id="insp-pct" style={{ color: 'var(--gr)' }}>{inspPct}% PASS RATE</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '9px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-add" onClick={onOpenCatalog || handleAddBlankInspRow}>＋ Add Surface Prep Test Row</button>
        <button type="button" className="btn btn-reset" onClick={handleClearInspRows}>↺ Clear All Rows</button>
        <button type="button" className="btn btn-save" onClick={handleAddStandard5Set}>⊞ Add Standard 5-Test Set</button>
      </div>

      <div className="xl-tbl-w">
        <table className="xl-tbl">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Sr.</th>
              <th style={{ textAlign: 'left', paddingLeft: '12px' }}>Test Parameter</th>
              <th style={{ width: '130px' }}>Standard Ref.</th>
              <th style={{ textAlign: 'left', paddingLeft: '12px' }}>Requirement</th>
              <th style={{ textAlign: 'left', paddingLeft: '12px' }}>Actual / Observed</th>
              <th style={{ width: '110px' }}>Result</th>
              <th style={{ width: '36px' }}>×</th>
            </tr>
          </thead>
          <tbody id="insp-tbody">
            {(state.inspRows || []).map((row, i) => (
              <tr key={i} data-id={i + 1}>
                <td><b>{i + 1}</b></td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ins-p txt-l-i"
                    value={row.p || ''}
                    placeholder="Test parameter"
                    onChange={(e) => handleInspRowChange(i, 'p', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="ins-std"
                    value={row.std || ''}
                    placeholder="Standard ref."
                    onChange={(e) => handleInspRowChange(i, 'std', e.target.value)}
                  />
                </td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ins-req txt-l-i"
                    value={row.req || ''}
                    placeholder="Requirement"
                    onChange={(e) => handleInspRowChange(i, 'req', e.target.value)}
                  />
                </td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ins-obs txt-l-i"
                    value={row.obs || ''}
                    placeholder="Actual / observed value"
                    onChange={(e) => handleInspRowChange(i, 'obs', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="ins-res"
                    value={row.res || ''}
                    onChange={(e) => handleInspRowChange(i, 'res', e.target.value)}
                  >
                    <option value="">— Select —</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="NA">N.A.</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="rep-act del"
                    title="Remove this row"
                    onClick={() => handleRemoveInspRow(i)}
                    style={{ width: '24px', height: '24px' }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="remark-box">
        <div className="remark-l">🔎 Inspection Result Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-insp"
          value={state.remarkInsp || ''}
          onChange={(e) => onChange('remarkInsp', e.target.value)}
          placeholder="Enter surface preparation and process inspection remarks..."
        ></textarea>
      </div>

      <div className="btn-row">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button type="button" className="btn nx" onClick={() => onNavigate('photo')}>Next: Photographic Report →</button>
      </div>
    </div>
  );
}
