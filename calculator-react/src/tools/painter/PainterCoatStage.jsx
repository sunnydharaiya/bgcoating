// src/tools/painter/PainterCoatStage.jsx
import React from 'react';
import { 
  COAT_STAGE_NAMES, 
  COAT_SIDS, 
  DFT_MINI_TYPES, 
  DFT_MINI_META, 
  COAT_DEFAULT_SETS, 
  COAT_TEST_CATALOG,
  calcRH, 
  calcDP, 
  calcCoatDFT, 
  computeOvercoatInterval 
} from '../../data/painterDatabase';

export default function PainterCoatStage({
  sid,
  formData,
  onChange,
  onOpenTestCatalog,
  onSyncCoatingSystem,
  onSaveDraft,
  onValidateApprove,
  onReset,
  onNavigate
}) {
  const stageName = COAT_STAGE_NAMES[sid] || sid;
  const coatIndex = COAT_SIDS.indexOf(sid);
  const prevSID = coatIndex > 0 ? COAT_SIDS[coatIndex - 1] : null;

  const coatSheet = formData?._coatSheets?.[sid] || {};
  const prevCoatSheet = prevSID ? (formData?._coatSheets?.[prevSID] || {}) : null;
  const coatDFT = formData?._coatDFT?.[sid] || {};
  const csRows = formData?._coatingSystem || [];

  // Previous and current coat DFT specs
  const curCS = csRows[coatIndex] || {};
  const prevCS = prevSID ? csRows[coatIndex - 1] : null;

  // Handler for coat sheet fields
  const handleFieldChange = (field, value) => {
    const updatedSheets = { ...(formData._coatSheets || {}) };
    updatedSheets[sid] = {
      ...(updatedSheets[sid] || {}),
      [field]: value
    };
    onChange('_coatSheets', updatedSheets);
  };

  // Environmental calculation
  const tdb = parseFloat(coatSheet.db);
  const twb = parseFloat(coatSheet.wb);
  const tmt = parseFloat(coatSheet.mt);
  const rh = calcRH(tdb, twb);
  const dp = calcDP(tdb, rh);
  const diff = (!isNaN(tmt) && !isNaN(dp)) ? (tmt - dp) : NaN;
  const envOK = !isNaN(rh) && !isNaN(diff) && rh <= 85 && diff >= 3.0;
  const hasEnv = !isNaN(rh) && !isNaN(diff);

  // Overcoat Interval Calculation
  const prevDate = prevCoatSheet?.date;
  const prevEnd = prevCoatSheet?.end;
  const curDate = coatSheet.date;
  const curStart = coatSheet.start;
  const autoOvercoat = prevSID ? computeOvercoatInterval(prevDate, prevEnd, curDate, curStart) : '— (First Layer / Primer)';

  // Batch Expiry Status Check
  const getBatchStatus = (batch, expDate) => {
    if (!batch && !expDate) return { text: '—', color: 'var(--txt3)' };
    if (/^na$|^n\/a$/i.test(batch?.trim())) return { text: 'N.A.', color: 'var(--txt2)' };
    if (!expDate) return { text: 'DATE?', color: '#E65100' };
    const exp = new Date(expDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (exp < today) return { text: 'EXPIRED', color: '#C62828' };
    const daysLeft = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) return { text: `${daysLeft}d LEFT`, color: '#E65100' };
    return { text: 'VALID ✓', color: '#2E7D32' };
  };

  // Test rows management
  const tests = coatSheet.tests || [];

  const handleTestRowChange = (index, field, value) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    handleFieldChange('tests', updatedTests);
  };

  const handleRemoveTest = (index) => {
    const updatedTests = tests.filter((_, i) => i !== index);
    handleFieldChange('tests', updatedTests);
  };

  const handleAddTestRow = () => {
    const updatedTests = [
      ...tests,
      {
        t: 'Custom Coating Test',
        std: 'Standard Reference',
        req: 'Technical Specification',
        act: '',
        res: ''
      }
    ];
    handleFieldChange('tests', updatedTests);
  };

  const handleClearTests = () => {
    handleFieldChange('tests', []);
  };

  const handleLoadStandardTests = () => {
    const defaultIndices = COAT_DEFAULT_SETS[sid] || [1, 2, 7, 8];
    const newTests = defaultIndices.map(idx => {
      const item = COAT_TEST_CATALOG[idx];
      return {
        t: item.t,
        std: item.std,
        req: item.req,
        act: idx === 0 ? 'Sa 2.5 Cleanliness Confirmed' : idx === 1 ? '110 µm WFT uniform' : idx === 2 ? 'Within specified tolerance' : 'Compliant',
        res: 'Pass'
      };
    });
    handleFieldChange('tests', newTests);
  };

  // DFT Matrix Management
  const dftMin = coatDFT.min || coatSheet.dftMin || curCS.min || (sid === 's1' ? '65' : '100');
  const dftMax = coatDFT.max || coatSheet.dftMax || curCS.max || (sid === 's1' ? '75' : '125');
  const dftByType = coatDFT.byType || {};
  const dftVerdict = coatDFT.verdict || '';

  const dftStats = calcCoatDFT(dftMin, dftMax, dftByType, dftVerdict);

  const handleDFTMinMaxChange = (field, value) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      [field]: value
    };
    onChange('_coatDFT', updatedDFT);

    // Also keep sync with coatSheet dftMin/dftMax
    if (field === 'min') handleFieldChange('dftMin', value);
    if (field === 'max') handleFieldChange('dftMax', value);
  };

  const handleDFTSpotChange = (type, rowIndex, spotIndex, value) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    const currentRow = { ...currentRows[rowIndex] };
    const currentSpots = [...(currentRow.spots || ['', '', '', ''])];
    currentSpots[spotIndex] = value;
    currentRow.spots = currentSpots;
    currentRows[rowIndex] = currentRow;
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleDFTRowLabelChange = (type, rowIndex, value) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    currentRows[rowIndex] = { ...currentRows[rowIndex], label: value };
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleAddDFTRow = (type) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = [...(currentByType[type] || [])];
    const nextNum = currentRows.length + 1;
    const defaultStem = DFT_MINI_META[type].labels[0].replace(/\s+\d+$/, '').trim();
    const newLabel = `${defaultStem} ${nextNum}`;
    currentRows.push({ label: newLabel, spots: ['', '', '', ''] });
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleRemoveDFTRow = (type, rowIndex) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const currentByType = { ...(updatedDFT[sid]?.byType || {}) };
    const currentRows = (currentByType[type] || []).filter((_, i) => i !== rowIndex);
    currentByType[type] = currentRows;

    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      byType: currentByType
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleLoadStandardDFT = () => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const byType = {};
    DFT_MINI_TYPES.forEach(type => {
      byType[type] = DFT_MINI_META[type].labels.map(lbl => ({
        label: lbl,
        spots: sid === 's1' ? ['70', '72', '68', '74'] : ['115', '118', '112', '120']
      }));
    });
    updatedDFT[sid] = {
      min: dftMin || (sid === 's1' ? '65' : '100'),
      max: dftMax || (sid === 's1' ? '75' : '125'),
      byType,
      verdict: 'Pass'
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleClearAllDFT = () => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    const byType = {};
    DFT_MINI_TYPES.forEach(type => {
      byType[type] = [];
    });
    updatedDFT[sid] = {
      min: dftMin,
      max: dftMax,
      byType,
      verdict: ''
    };
    onChange('_coatDFT', updatedDFT);
  };

  const handleDFTVerdictChange = (val) => {
    const updatedDFT = { ...(formData._coatDFT || {}) };
    updatedDFT[sid] = {
      ...(updatedDFT[sid] || {}),
      verdict: val
    };
    onChange('_coatDFT', updatedDFT);
  };

  // Next destination mapping
  const nextStageMap = {
    s1: { label: 'Next: 1st Coat →', target: 's2' },
    s2: { label: 'Next: 2nd Coat →', target: 's3' },
    s3: { label: 'Next: 3rd Coat →', target: 's4' },
    s4: { label: 'Next: Photographic Report →', target: 'photo' }
  };
  const nextStage = nextStageMap[sid];

  // Helper for spot background coloring based on 80%-120% rule
  const getSpotStyle = (spotVal) => {
    const val = parseFloat(spotVal);
    if (isNaN(val)) return {};
    const low = dftStats.low;
    const high = dftStats.high;
    if (isNaN(low) || isNaN(high)) return {};
    if (val >= low && val <= high) {
      return { backgroundColor: '#C6EFCE', color: '#006100', fontWeight: '700' };
    }
    return { backgroundColor: '#FFC7CE', color: '#9C0006', fontWeight: '700' };
  };

  return (
    <div className="sheet" id={`sh-${sid}`}>
      {/* Corporate Header */}
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">{stageName.toUpperCase()} · COATING INSPECTION SHEET</div>
          <div className="xl-corp-s">
            Stage: <b>{stageName}</b> · Application Parameters · Paint Details · WFT / DFT / Adhesion · Per-coat environmental snapshot
          </div>
        </div>
      </div>

      {/* 0. Application Parameters */}
      <div className="xl-sec-h" id={`sec-${sid}-0`}>
        <span className="ic">🛠️</span>Coating Application · Application Parameters
      </div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">Method</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-method`}
              list="dl-coat-method"
              placeholder="e.g. Airless Spray"
              value={coatSheet.method || ''}
              onChange={(e) => handleFieldChange('method', e.target.value)}
            />
            <datalist id="dl-coat-method">
              <option value="Airless Spray" />
              <option value="Air Spray (Conventional)" />
              <option value="Air-Assisted Airless" />
              <option value="HVLP" />
              <option value="Electrostatic Spray" />
              <option value="Brush" />
              <option value="Roller" />
              <option value="Brush + Spray (Stripe Coat)" />
            </datalist>
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Stripe Coat</div>
          <div className="xl-cell-v">
            <select
              id={`${sid}-stripe`}
              value={coatSheet.stripe || ''}
              onChange={(e) => handleFieldChange('stripe', e.target.value)}
            >
              <option value="">— Select —</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Visible Rusting?</div>
          <div className="xl-cell-v">
            <select
              id={`${sid}-rust`}
              value={coatSheet.rust || ''}
              onChange={(e) => handleFieldChange('rust', e.target.value)}
            >
              <option value="">— Select —</option>
              <option value="NO">NO</option>
              <option value="YES — minor">YES — minor</option>
              <option value="YES — significant">YES — significant</option>
            </select>
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Stage</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-stage`}
              value={stageName}
              readOnly
              style={{ background: 'var(--bg5)', fontWeight: 600, color: 'var(--o1)' }}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Coating Start (HH:MM)</div>
          <div className="xl-cell-v">
            <input
              type="time"
              id={`${sid}-start`}
              value={coatSheet.start || ''}
              onChange={(e) => handleFieldChange('start', e.target.value)}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Coating End (HH:MM)</div>
          <div className="xl-cell-v">
            <input
              type="time"
              id={`${sid}-end`}
              value={coatSheet.end || ''}
              onChange={(e) => handleFieldChange('end', e.target.value)}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Application Date</div>
          <div className="xl-cell-v">
            <input
              type="date"
              id={`${sid}-date`}
              value={coatSheet.date || ''}
              onChange={(e) => handleFieldChange('date', e.target.value)}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Recoat Interval Check</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-recoat`}
              placeholder="e.g. 6 hrs min · OK"
              value={coatSheet.recoat || autoOvercoat || ''}
              onChange={(e) => handleFieldChange('recoat', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 1. Paint / Coating Details */}
      <div className="xl-sec-h" id={`sec-${sid}-1`}>
        <span className="ic">🪣</span>Coating Application · Paint / Coating Details
        <span className="num">SINGLE MANUFACTURER · 2-COMPONENT TRACEABILITY</span>
      </div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">Paint / Coating Manufacturer</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input
              type="text"
              id={`${sid}-mfr`}
              list="dl-paint-mfr"
              placeholder="Select or type manufacturer"
              value={coatSheet.mfr || ''}
              onChange={(e) => handleFieldChange('mfr', e.target.value)}
            />
            <datalist id="dl-paint-mfr">
              <option value="AkzoNobel (International Paint)" />
              <option value="Jotun" />
              <option value="Hempel" />
              <option value="PPG Industries" />
              <option value="Sherwin-Williams" />
              <option value="Asian Paints" />
              <option value="Sigma Coatings" />
              <option value="Berger Paints" />
              <option value="Kansai Nerolac" />
              <option value="Carboline" />
              <option value="Tnemec" />
              <option value="OTHERS" />
            </datalist>
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Paint / Coating Product Name</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input
              type="text"
              id={`${sid}-product`}
              placeholder="Type product name (manual entry)"
              value={coatSheet.product || ''}
              onChange={(e) => handleFieldChange('product', e.target.value)}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Shade / RAL No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-shade`}
              placeholder="e.g. RAL 9003"
              value={coatSheet.shade || ''}
              onChange={(e) => handleFieldChange('shade', e.target.value)}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Generic Type</div>
          <div className="xl-cell-v xl-cell-span-2">
            <input
              type="text"
              id={`${sid}-generic`}
              placeholder="e.g. Inorganic Zinc Silicate Primer"
              value={coatSheet.generic || (sid === 's1' ? 'Inorganic Zinc Silicate Primer' : 'High Build Epoxy Intermediate')}
              onChange={(e) => handleFieldChange('generic', e.target.value)}
            />
          </div>
        </div>

        {/* Part A / B / C Batch and Expiry */}
        <div className="xl-cell">
          <div className="xl-cell-l">Part A Batch No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-batchA`}
              placeholder="Manual entry"
              value={coatSheet.batchA || ''}
              onChange={(e) => handleFieldChange('batchA', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part A Expiry Date</div>
          <div className="xl-cell-v">
            <input
              type="date"
              id={`${sid}-expA`}
              value={coatSheet.expA || ''}
              onChange={(e) => handleFieldChange('expA', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part A Status</div>
          <div
            className="xl-cell-v"
            id={`${sid}-statA`}
            style={{ textAlign: 'center', fontWeight: 700, color: getBatchStatus(coatSheet.batchA, coatSheet.expA).color }}
          >
            {getBatchStatus(coatSheet.batchA, coatSheet.expA).text}
          </div>
        </div>
        <div className="xl-cell"><div className="xl-cell-l" /><div className="xl-cell-v" /></div>

        <div className="xl-cell">
          <div className="xl-cell-l">Part B Batch No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-batchB`}
              placeholder="Manual entry"
              value={coatSheet.batchB || ''}
              onChange={(e) => handleFieldChange('batchB', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part B Expiry Date</div>
          <div className="xl-cell-v">
            <input
              type="date"
              id={`${sid}-expB`}
              value={coatSheet.expB || ''}
              onChange={(e) => handleFieldChange('expB', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part B Status</div>
          <div
            className="xl-cell-v"
            id={`${sid}-statB`}
            style={{ textAlign: 'center', fontWeight: 700, color: getBatchStatus(coatSheet.batchB, coatSheet.expB).color }}
          >
            {getBatchStatus(coatSheet.batchB, coatSheet.expB).text}
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Mixing Ratio</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-ratio`}
              placeholder="e.g. 4:1"
              value={coatSheet.ratio || ''}
              onChange={(e) => handleFieldChange('ratio', e.target.value)}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>

        <div className="xl-cell">
          <div className="xl-cell-l">Part C Batch No.</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-batchC`}
              placeholder="Manual entry / NA"
              value={coatSheet.batchC || ''}
              onChange={(e) => handleFieldChange('batchC', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part C Expiry Date</div>
          <div className="xl-cell-v">
            <input
              type="date"
              id={`${sid}-expC`}
              value={coatSheet.expC || ''}
              onChange={(e) => handleFieldChange('expC', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Part C Status</div>
          <div
            className="xl-cell-v"
            id={`${sid}-statC`}
            style={{ textAlign: 'center', fontWeight: 700, color: getBatchStatus(coatSheet.batchC, coatSheet.expC).color }}
          >
            {getBatchStatus(coatSheet.batchC, coatSheet.expC).text}
          </div>
        </div>
        <div className="xl-cell"><div className="xl-cell-l" /><div className="xl-cell-v" /></div>

        <div className="xl-cell">
          <div className="xl-cell-l">Specified DFT Min (µm)</div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dftspec-min`}
              placeholder="e.g. 65"
              value={dftMin}
              onChange={(e) => handleDFTMinMaxChange('min', e.target.value)}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Specified DFT Max (µm)</div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dftspec-max`}
              placeholder="e.g. 75"
              value={dftMax}
              onChange={(e) => handleDFTMinMaxChange('max', e.target.value)}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>
        <div className="xl-cell"><div className="xl-cell-l" /><div className="xl-cell-v" /></div>
        <div className="xl-cell"><div className="xl-cell-l" /><div className="xl-cell-v" /></div>
      </div>

      {/* 2. Environmental Snapshot */}
      <div className="xl-sec-h" id={`sec-${sid}-2`}>
        <span className="ic">🌤️</span>Environmental Snapshot at Application
        <span className="num">SHORT-DURATION SESSION · ~1 HOUR</span>
      </div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">Dry Bulb (°C)</div>
          <div className="xl-cell-v">
            <input
              type="number"
              step="0.1"
              id={`${sid}-db`}
              placeholder="e.g. 30"
              value={coatSheet.db || ''}
              onChange={(e) => handleFieldChange('db', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Wet Bulb (°C)</div>
          <div className="xl-cell-v">
            <input
              type="number"
              step="0.1"
              id={`${sid}-wb`}
              placeholder="e.g. 24"
              value={coatSheet.wb || ''}
              onChange={(e) => handleFieldChange('wb', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Steel Temp (°C)</div>
          <div className="xl-cell-v">
            <input
              type="number"
              step="0.1"
              id={`${sid}-mt`}
              placeholder="e.g. 32"
              value={coatSheet.mt || ''}
              onChange={(e) => handleFieldChange('mt', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Relative Humidity (%)</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-rh`}
              readOnly
              value={!isNaN(rh) ? `${rh}%` : '—'}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, textAlign: 'center' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Dew Point (°C)</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-dp`}
              readOnly
              value={!isNaN(dp) ? `${dp}°C` : '—'}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, textAlign: 'center' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">MT − DP (°C)</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-diff`}
              readOnly
              value={!isNaN(diff) ? `${diff.toFixed(1)}°C` : '—'}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, textAlign: 'center' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Time of Reading</div>
          <div className="xl-cell-v">
            <input
              type="time"
              id={`${sid}-envtime`}
              value={coatSheet.envtime || ''}
              onChange={(e) => handleFieldChange('envtime', e.target.value)}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Env. Verdict</div>
          <div
            className="xl-cell-v"
            id={`${sid}-envverdict`}
            style={{
              textAlign: 'center',
              fontWeight: 700,
              color: !hasEnv ? 'var(--txt3)' : envOK ? '#2E7D32' : '#C62828'
            }}
          >
            {!hasEnv ? '—' : envOK ? 'PASS ✓' : 'FAIL ✗ (Out of Limits)'}
          </div>
        </div>
      </div>

      {/* 3. Coating Test Parameters */}
      <div className="xl-sec-h" id={`sec-${sid}-3`}>
        <span className="ic">🧪</span>Coating Test Parameters · Inspection Result
        <span className="num">WFT / DFT / ADHESION</span>
      </div>
      <div className="xl-tbl-w">
        <table className="xl-tbl">
          <thead>
            <tr>
              <th style={{ width: '36px' }}>Sr.</th>
              <th style={{ textAlign: 'left', paddingLeft: '10px' }}>Test Parameter</th>
              <th style={{ width: '140px' }}>Standard Reference</th>
              <th style={{ textAlign: 'left', paddingLeft: '10px' }}>Requirement</th>
              <th style={{ textAlign: 'left', paddingLeft: '10px' }}>Actual Result</th>
              <th style={{ width: '100px' }}>Result</th>
              <th style={{ width: '36px' }}>×</th>
            </tr>
          </thead>
          <tbody id={`${sid}-test-tbody`}>
            {tests.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}><b>{i + 1}</b></td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ct-p txt-l-i"
                    value={row.t || ''}
                    placeholder="Test parameter"
                    onChange={(e) => handleTestRowChange(i, 't', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="ct-std"
                    value={row.std || ''}
                    placeholder="Standard"
                    onChange={(e) => handleTestRowChange(i, 'std', e.target.value)}
                  />
                </td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ct-req txt-l-i"
                    value={row.req || ''}
                    placeholder="Requirement"
                    onChange={(e) => handleTestRowChange(i, 'req', e.target.value)}
                  />
                </td>
                <td className="txt-l">
                  <input
                    type="text"
                    className="ct-act txt-l-i"
                    value={row.act || ''}
                    placeholder="Actual result"
                    onChange={(e) => handleTestRowChange(i, 'act', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="ct-res"
                    value={row.res || ''}
                    onChange={(e) => handleTestRowChange(i, 'res', e.target.value)}
                  >
                    <option value="">⌛ Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="NA">N.A.</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="rep-act del"
                    title="Remove"
                    onClick={() => handleRemoveTest(i)}
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
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-add"
          onClick={handleAddTestRow}
        >
          ＋ Add Coating Test Row
        </button>
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleClearTests}
        >
          ↺ Clear Tests
        </button>
        <button
          type="button"
          className="btn btn-save"
          onClick={handleLoadStandardTests}
        >
          ⊞ Standard Set ({sid === 's1' ? '5 Tests · incl. Blasting Visual' : '4 Tests'})
        </button>
      </div>

      {/* 4. DFT Information Panel & SSPC PA-2 Matrix */}
      <div className="dft-info-panel" id={`${sid}-dftinfo`}>
        <div className="dfi-card dfi-prev">
          <div className="dfi-h">◀ Previous Coat Layer</div>
          <div className="dfi-name">
            {prevCoatSheet?.generic || prevCoatSheet?.product || 'Substrate — no previous coat (first layer)'}
          </div>
          <div className="dfi-dft">
            Coat DFT: <b>{prevCS ? `${prevCS.min} – ${prevCS.max} µm` : '—'}</b>
          </div>
        </div>
        <div className="dfi-card dfi-cur">
          <div className="dfi-h">● Current Coat Layer</div>
          <div className="dfi-name">
            {coatSheet.generic || coatSheet.product || (sid === 's1' ? 'Inorganic Zinc Silicate Primer' : 'Intermediate Coating')}
          </div>
          <div className="dfi-dft">
            Coat DFT: <b>{dftMin} – {dftMax} µm</b>
          </div>
        </div>
        <div className="dfi-card dfi-cum">
          <div className="dfi-h">Σ Cumulative DFT (through this coat)</div>
          <div className="dfi-name">Total built-up film thickness</div>
          <div className="dfi-dft">
            Required: <b>{dftMin} – {dftMax} µm</b>
          </div>
        </div>
      </div>

      <div className="xl-sec-h" id={`sec-${sid}-4`}>
        <span className="ic">📐</span>DFT Measurement · This Coat
        <span className="num">SSPC PA-2 · 80%-120%</span>
      </div>
      <div className="xl-info xl-info-4">
        <div className="xl-cell">
          <div className="xl-cell-l">
            Specified Min (µm) <span style={{ fontSize: '8px', color: 'var(--o1)', fontWeight: 600 }}>⟲ auto from Paint Details</span>
          </div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dft-min`}
              placeholder="e.g. 65"
              value={dftMin}
              onChange={(e) => handleDFTMinMaxChange('min', e.target.value)}
              style={{ background: '#FFFBF0' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">
            Specified Max (µm) <span style={{ fontSize: '8px', color: 'var(--o1)', fontWeight: 600 }}>⟲ auto from Paint Details</span>
          </div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dft-max`}
              placeholder="e.g. 75"
              value={dftMax}
              onChange={(e) => handleDFTMinMaxChange('max', e.target.value)}
              style={{ background: '#FFFBF0' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">80% Lower Limit</div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dft-low`}
              readOnly
              value={!isNaN(dftStats.low) ? dftStats.low : ''}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700 }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">120% Upper Limit</div>
          <div className="xl-cell-v">
            <input
              type="number"
              id={`${sid}-dft-high`}
              readOnly
              value={!isNaN(dftStats.high) ? dftStats.high : ''}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700 }}
            />
          </div>
        </div>
      </div>

      {/* Qualification Plate Image + Legend side-by-side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        gap: '14px',
        background: '#fff',
        border: '1.5px solid var(--bdr)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '14px',
        boxShadow: 'var(--sh)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg,var(--bg5),#fff)',
          border: '1.5px dashed var(--bdr2)',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--o1)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Operator Qualification Test Plate
          </div>
          <svg viewBox="0 0 700 480" style={{ width: '100%', maxWidth: '520px', height: 'auto', fontFamily: "'Inter',sans-serif" }} xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="40" width="620" height="400" fill="#FFFAF0" stroke="#14181F" strokeWidth="2" />
            <text x="350" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14181F">5'-0"</text>
            <line x1="40" y1="32" x2="660" y2="32" stroke="#14181F" strokeWidth="1" />
            <line x1="40" y1="28" x2="40" y2="36" stroke="#14181F" strokeWidth="1" />
            <line x1="660" y1="28" x2="660" y2="36" stroke="#14181F" strokeWidth="1" />
            <text x="22" y="240" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14181F" transform="rotate(-90 22 240)">5'-0"</text>
            {/* bolts top row */}
            <circle cx="115" cy="80" r="11" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
            <text x="115" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14181F">1</text>
            <circle cx="220" cy="80" r="11" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
            <text x="220" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14181F">1</text>
            <circle cx="430" cy="80" r="11" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
            <text x="430" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14181F">4</text>
            <circle cx="500" cy="80" r="11" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
            <text x="500" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#14181F">4</text>
            <text x="80" y="50" fontSize="9.5" fill="#14181F" fontStyle="italic">1" diameter bolt and nut</text>
            <line x1="100" y1="56" x2="115" y2="68" stroke="#14181F" strokeWidth="0.6" />
            {/* 12" Wide Flange */}
            <g>
              <rect x="80" y="170" width="100" height="60" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
              <line x1="125" y1="170" x2="125" y2="230" stroke="#14181F" strokeWidth="1" />
              <line x1="155" y1="170" x2="155" y2="230" stroke="#14181F" strokeWidth="1" />
              <line x1="80" y1="195" x2="180" y2="195" stroke="#14181F" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="80" y1="205" x2="180" y2="205" stroke="#14181F" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x="100" y="160" fontSize="9.5" fontWeight="700" fill="#14181F">3</text>
              <text x="20" y="200" fontSize="9" fill="#14181F" fontStyle="italic">12" wide</text>
              <text x="20" y="212" fontSize="9" fill="#14181F" fontStyle="italic">flange</text>
              <text x="20" y="224" fontSize="9" fill="#14181F" fontStyle="italic">1'-6" long</text>
              <text x="92" y="186" fontSize="9" fontWeight="700" fill="#9E1B1E">1</text>
              <text x="138" y="186" fontSize="9" fontWeight="700" fill="#9E1B1E">2</text>
              <text x="168" y="186" fontSize="9" fontWeight="700" fill="#9E1B1E">3</text>
              <text x="92" y="222" fontSize="9" fontWeight="700" fill="#9E1B1E">5</text>
              <text x="138" y="222" fontSize="9" fontWeight="700" fill="#9E1B1E">6</text>
              <text x="168" y="222" fontSize="9" fontWeight="700" fill="#9E1B1E">8</text>
              <text x="115" y="204" fontSize="9" fontWeight="700" fill="#9E1B1E">4</text>
              <text x="158" y="204" fontSize="9" fontWeight="700" fill="#9E1B1E">7</text>
            </g>
            {/* 6" Pipe */}
            <g>
              <circle cx="490" cy="190" r="40" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
              <text x="510" y="160" fontSize="9.5" fontWeight="700" fill="#14181F">4</text>
              <text x="540" y="180" fontSize="9" fill="#14181F" fontStyle="italic">6" diameter</text>
              <text x="540" y="192" fontSize="9" fill="#14181F" fontStyle="italic">pipe</text>
              <text x="540" y="204" fontSize="9" fill="#14181F" fontStyle="italic">1'-6" long</text>
              <text x="485" y="158" fontSize="9" fontWeight="700" fill="#9E1B1E">1</text>
              <text x="522" y="195" fontSize="9" fontWeight="700" fill="#9E1B1E">2</text>
              <text x="485" y="232" fontSize="9" fontWeight="700" fill="#9E1B1E">3</text>
              <text x="450" y="195" fontSize="9" fontWeight="700" fill="#9E1B1E">4</text>
            </g>
            {/* 6" T-Beam */}
            <g>
              <rect x="80" y="320" width="540" height="40" fill="#fff" stroke="#14181F" strokeWidth="1.5" />
              <line x1="80" y1="335" x2="620" y2="335" stroke="#14181F" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="80" y1="348" x2="620" y2="348" stroke="#14181F" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x="50" y="330" fontSize="9.5" fontWeight="700" fill="#14181F">2</text>
              <text x="32" y="345" fontSize="9" fill="#14181F" fontStyle="italic">6" deep T</text>
              <text x="32" y="357" fontSize="9" fill="#14181F" fontStyle="italic">beam with</text>
              <text x="32" y="369" fontSize="9" fill="#14181F" fontStyle="italic">sealed ends</text>
              <text x="400" y="312" fontSize="9" fontWeight="700" fill="#14181F">Backside</text>
              <line x1="395" y1="316" x2="395" y2="325" stroke="#14181F" strokeWidth="0.6" />
              <text x="125" y="335" fontSize="9" fontWeight="700" fill="#9E1B1E">1</text>
              <text x="250" y="335" fontSize="9" fontWeight="700" fill="#9E1B1E">2</text>
              <text x="375" y="335" fontSize="9" fontWeight="700" fill="#9E1B1E">3</text>
              <text x="555" y="335" fontSize="9" fontWeight="700" fill="#9E1B1E">4</text>
              <text x="125" y="358" fontSize="9" fontWeight="700" fill="#9E1B1E">5</text>
              <text x="250" y="358" fontSize="9" fontWeight="700" fill="#9E1B1E">6</text>
              <text x="375" y="358" fontSize="9" fontWeight="700" fill="#9E1B1E">7</text>
              <text x="555" y="358" fontSize="9" fontWeight="700" fill="#9E1B1E">8</text>
            </g>
            <text x="675" y="180" fontSize="10" fontWeight="700" fill="#14181F">5'-0"</text>
            <line x1="668" y1="40" x2="668" y2="320" stroke="#14181F" strokeWidth="0.8" />
            <text x="675" y="385" fontSize="10" fontWeight="700" fill="#14181F">1'-0"</text>
            <line x1="668" y1="320" x2="668" y2="360" stroke="#14181F" strokeWidth="0.8" />
            <text x="675" y="420" fontSize="10" fontWeight="700" fill="#14181F">1'-0"</text>
            <line x1="668" y1="360" x2="668" y2="440" stroke="#14181F" strokeWidth="0.8" />
            <text x="350" y="460" textAnchor="middle" fontSize="9.5" fill="#14181F" fontStyle="italic" fontWeight="600">
              Numbered red points indicate DFT measurement positions per side
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{
          background: 'linear-gradient(180deg,#FFFBF5,#fff)',
          border: '1.5px solid var(--bdr2)',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '11.5px',
          lineHeight: '1.55',
          color: '#14181F'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--o1)',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            borderBottom: '1.5px dashed var(--bdr2)',
            paddingBottom: '6px'
          }}>
            📋 DFT Spot-Reading Legend
          </div>
          <div style={{ marginBottom: '9px' }}>
            <b style={{ color: '#9E1B1E' }}>①</b> &nbsp;<b>Plain Plate</b> — Minimum <b>12 Spot Readings</b> uniformly across the plate surface to evaluate overall DFT distribution and coating consistency.
          </div>
          <div style={{ marginBottom: '9px' }}>
            <b style={{ color: '#9E1B1E' }}>②</b> &nbsp;<b>6" Deep T-Beam with Sealed Ends</b> — Total <b>8 sides / orientations</b>, with a minimum of <b>4 Spot Readings per side</b> to ensure adequate DFT coverage and uniformity throughout the profile.
          </div>
          <div style={{ marginBottom: '9px' }}>
            <b style={{ color: '#9E1B1E' }}>③</b> &nbsp;<b>12" Wide Flange Section</b> — Total <b>8 sides / orientations</b>, with a minimum of <b>4 Spot Readings per side</b> to verify coating thickness uniformity across all accessible surfaces.
          </div>
          <div style={{ marginBottom: '9px' }}>
            <b style={{ color: '#9E1B1E' }}>④</b> &nbsp;<b>6" Diameter Pipe Section</b> — DFT inspection at <b>4 circumferential orientations</b>, each with a minimum of <b>4 Spot Readings</b> along the pipe length to confirm uniform coating application.
          </div>
          <div style={{
            marginTop: '11px',
            padding: '8px 10px',
            background: '#FFF8E1',
            borderLeft: '3px solid #E65100',
            borderRadius: '4px',
            fontSize: '10.5px',
            color: '#5D2A00'
          }}>
            <b>Note:</b> The minimum DFT reading quantity stated above is for <b>reference only — it is not mandatory</b>. The inspector may increase or decrease the number of DFT readings based on field experience, professional judgment and real site conditions.
          </div>
        </div>
      </div>

      {/* Mini-Tables Header Note */}
      <div style={{ marginBottom: '9px', fontSize: '11px', color: 'var(--txt2)', textAlign: 'right' }}>
        Cells coloured per 80%-120% rule · In-spec <span style={{ background: '#C6EFCE', color: '#006100', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>green</span> · Out-of-range <span style={{ background: '#FFC7CE', color: '#9C0006', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>red</span>
      </div>

      {/* 4 Mini-Tables Grid */}
      <div className="dft-mini-grid">
        {/* 1. Plane Surface */}
        <div className="dft-mini" data-sid={sid} data-type="plane">
          <table className="dft-mini-tbl">
            <thead>
              <tr className="title"><th colSpan="6">1. Plane Surface DFT in Microns</th></tr>
              <tr className="sub">
                <th style={{ width: '96px' }}>Position</th>
                <th>R1</th><th>R2</th><th>R3</th><th>R4</th>
                <th style={{ width: '28px' }}>×</th>
              </tr>
            </thead>
            <tbody id={`${sid}-dft-plane-tbody`}>
              {(dftByType.plane || []).map((row, rIdx) => (
                <tr key={rIdx}>
                  <td>
                    <input
                      type="text"
                      className="dft-mini-label"
                      value={row.label || `Raw ${rIdx + 1}`}
                      placeholder="Position"
                      onChange={(e) => handleDFTRowLabelChange('plane', rIdx, e.target.value)}
                    />
                  </td>
                  {[0, 1, 2, 3].map((sIdx) => (
                    <td key={sIdx}>
                      <input
                        type="number"
                        className="dft-mini-spot"
                        value={row.spots?.[sIdx] || ''}
                        onChange={(e) => handleDFTSpotChange('plane', rIdx, sIdx, e.target.value)}
                        style={getSpotStyle(row.spots?.[sIdx])}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="dft-mini-rm"
                      title="Remove this reading"
                      onClick={() => handleRemoveDFTRow('plane', rIdx)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="avg">
                <td>Average Reading</td>
                <td colSpan="4" className="dft-mini-avg">
                  {!isNaN(dftStats.typeStats?.plane?.avg) ? `${dftStats.typeStats.plane.avg.toFixed(1)} µm` : '—'}
                </td>
                <td />
              </tr>
              <tr className="tot">
                <td>Total Readings</td>
                <td colSpan="4" className="dft-mini-tot">
                  {dftStats.typeStats?.plane?.tot || 0}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
          <button
            type="button"
            className="dft-mini-add-btn"
            onClick={() => handleAddDFTRow('plane')}
          >
            ＋ Add Row
          </button>
        </div>

        {/* 2. 6" Diameter Pipe */}
        <div className="dft-mini" data-sid={sid} data-type="pipe">
          <table className="dft-mini-tbl">
            <thead>
              <tr className="title"><th colSpan="6">4. 6" Diameter Pipe DFT in Microns</th></tr>
              <tr className="sub">
                <th style={{ width: '96px' }}>Position</th>
                <th>R1</th><th>R2</th><th>R3</th><th>R4</th>
                <th style={{ width: '28px' }}>×</th>
              </tr>
            </thead>
            <tbody id={`${sid}-dft-pipe-tbody`}>
              {(dftByType.pipe || []).map((row, rIdx) => (
                <tr key={rIdx}>
                  <td>
                    <input
                      type="text"
                      className="dft-mini-label"
                      value={row.label || `Orientation ${rIdx + 1}`}
                      placeholder="Position"
                      onChange={(e) => handleDFTRowLabelChange('pipe', rIdx, e.target.value)}
                    />
                  </td>
                  {[0, 1, 2, 3].map((sIdx) => (
                    <td key={sIdx}>
                      <input
                        type="number"
                        className="dft-mini-spot"
                        value={row.spots?.[sIdx] || ''}
                        onChange={(e) => handleDFTSpotChange('pipe', rIdx, sIdx, e.target.value)}
                        style={getSpotStyle(row.spots?.[sIdx])}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="dft-mini-rm"
                      title="Remove this reading"
                      onClick={() => handleRemoveDFTRow('pipe', rIdx)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="avg">
                <td>Average Reading</td>
                <td colSpan="4" className="dft-mini-avg">
                  {!isNaN(dftStats.typeStats?.pipe?.avg) ? `${dftStats.typeStats.pipe.avg.toFixed(1)} µm` : '—'}
                </td>
                <td />
              </tr>
              <tr className="tot">
                <td>Total Readings</td>
                <td colSpan="4" className="dft-mini-tot">
                  {dftStats.typeStats?.pipe?.tot || 0}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
          <button
            type="button"
            className="dft-mini-add-btn"
            onClick={() => handleAddDFTRow('pipe')}
          >
            ＋ Add Row
          </button>
        </div>

        {/* 3. 6" Deep T-Beam */}
        <div className="dft-mini" data-sid={sid} data-type="tbeam">
          <table className="dft-mini-tbl">
            <thead>
              <tr className="title"><th colSpan="6">2. 6" Deep T-Beam DFT in Microns</th></tr>
              <tr className="sub">
                <th style={{ width: '96px' }}>Position</th>
                <th>R1</th><th>R2</th><th>R3</th><th>R4</th>
                <th style={{ width: '28px' }}>×</th>
              </tr>
            </thead>
            <tbody id={`${sid}-dft-tbeam-tbody`}>
              {(dftByType.tbeam || []).map((row, rIdx) => (
                <tr key={rIdx}>
                  <td>
                    <input
                      type="text"
                      className="dft-mini-label"
                      value={row.label || `Side ${rIdx + 1}`}
                      placeholder="Position"
                      onChange={(e) => handleDFTRowLabelChange('tbeam', rIdx, e.target.value)}
                    />
                  </td>
                  {[0, 1, 2, 3].map((sIdx) => (
                    <td key={sIdx}>
                      <input
                        type="number"
                        className="dft-mini-spot"
                        value={row.spots?.[sIdx] || ''}
                        onChange={(e) => handleDFTSpotChange('tbeam', rIdx, sIdx, e.target.value)}
                        style={getSpotStyle(row.spots?.[sIdx])}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="dft-mini-rm"
                      title="Remove this reading"
                      onClick={() => handleRemoveDFTRow('tbeam', rIdx)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="avg">
                <td>Average Reading</td>
                <td colSpan="4" className="dft-mini-avg">
                  {!isNaN(dftStats.typeStats?.tbeam?.avg) ? `${dftStats.typeStats.tbeam.avg.toFixed(1)} µm` : '—'}
                </td>
                <td />
              </tr>
              <tr className="tot">
                <td>Total Readings</td>
                <td colSpan="4" className="dft-mini-tot">
                  {dftStats.typeStats?.tbeam?.tot || 0}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
          <button
            type="button"
            className="dft-mini-add-btn"
            onClick={() => handleAddDFTRow('tbeam')}
          >
            ＋ Add Row
          </button>
        </div>

        {/* 4. 12" Wide Flange */}
        <div className="dft-mini" data-sid={sid} data-type="flange">
          <table className="dft-mini-tbl">
            <thead>
              <tr className="title"><th colSpan="6">3. 12" Wide Flange DFT in Microns</th></tr>
              <tr className="sub">
                <th style={{ width: '96px' }}>Position</th>
                <th>R1</th><th>R2</th><th>R3</th><th>R4</th>
                <th style={{ width: '28px' }}>×</th>
              </tr>
            </thead>
            <tbody id={`${sid}-dft-flange-tbody`}>
              {(dftByType.flange || []).map((row, rIdx) => (
                <tr key={rIdx}>
                  <td>
                    <input
                      type="text"
                      className="dft-mini-label"
                      value={row.label || `Side ${rIdx + 1}`}
                      placeholder="Position"
                      onChange={(e) => handleDFTRowLabelChange('flange', rIdx, e.target.value)}
                    />
                  </td>
                  {[0, 1, 2, 3].map((sIdx) => (
                    <td key={sIdx}>
                      <input
                        type="number"
                        className="dft-mini-spot"
                        value={row.spots?.[sIdx] || ''}
                        onChange={(e) => handleDFTSpotChange('flange', rIdx, sIdx, e.target.value)}
                        style={getSpotStyle(row.spots?.[sIdx])}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="dft-mini-rm"
                      title="Remove this reading"
                      onClick={() => handleRemoveDFTRow('flange', rIdx)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="avg">
                <td>Average Reading</td>
                <td colSpan="4" className="dft-mini-avg">
                  {!isNaN(dftStats.typeStats?.flange?.avg) ? `${dftStats.typeStats.flange.avg.toFixed(1)} µm` : '—'}
                </td>
                <td />
              </tr>
              <tr className="tot">
                <td>Total Readings</td>
                <td colSpan="4" className="dft-mini-tot">
                  {dftStats.typeStats?.flange?.tot || 0}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
          <button
            type="button"
            className="dft-mini-add-btn"
            onClick={() => handleAddDFTRow('flange')}
          >
            ＋ Add Row
          </button>
        </div>
      </div>

      {/* Grand Total Banner */}
      <div className="dft-grand-total">
        <div>
          Total Average <span className="gt-val">{!isNaN(dftStats.overallAvg) ? `${dftStats.overallAvg.toFixed(1)} µm` : '—'}</span>
        </div>
        <div>
          Total Reading <span className="gt-val">{dftStats.totalReadings}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleClearAllDFT}
        >
          ↺ Clear All DFT
        </button>
        <button
          type="button"
          className="btn btn-save"
          onClick={handleLoadStandardDFT}
        >
          ⊞ Load Standard DFT Annexure
        </button>
      </div>

      {/* Coat DFT Summary counters */}
      <div className="xl-info xl-info-4" style={{ marginTop: '10px' }}>
        <div className="xl-cell">
          <div className="xl-cell-l">Final Average DFT (µm)</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-dft-overall-avg`}
              readOnly
              value={!isNaN(dftStats.overallAvg) ? `${dftStats.overallAvg.toFixed(1)} µm` : '—'}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, fontSize: '13px', textAlign: 'center', fontFamily: 'Rajdhani,sans-serif' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Total DFT Readings</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-dft-total`}
              readOnly
              value={dftStats.totalReadings}
              style={{ background: 'var(--bg5)', color: 'var(--o1)', fontWeight: 700, fontSize: '13px', textAlign: 'center', fontFamily: 'Rajdhani,sans-serif' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">Readings Out of Range</div>
          <div className="xl-cell-v">
            <input
              type="text"
              id={`${sid}-dft-out`}
              readOnly
              value={dftStats.outOfRange}
              style={{ background: '#FFEBEE', color: '#C62828', fontWeight: 700, fontSize: '13px', textAlign: 'center', fontFamily: 'Rajdhani,sans-serif' }}
            />
          </div>
        </div>
        <div className="xl-cell">
          <div className="xl-cell-l">
            DFT Verdict <span style={{ fontSize: '8px', color: 'var(--o1)', fontWeight: 600 }}>(user authority)</span>
          </div>
          <div className="xl-cell-v" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <select
              id={`${sid}-dft-verdict-sel`}
              value={dftVerdict}
              onChange={(e) => handleDFTVerdictChange(e.target.value)}
              style={{ fontWeight: 700, padding: '4px 6px', borderRadius: '5px', border: '1px solid var(--bdr2)' }}
            >
              <option value="">— Auto —</option>
              <option value="Pass">Pass</option>
              <option value="Rework">Rework</option>
              <option value="NA">N.A.</option>
            </select>
            <span
              id={`${sid}-dft-verdict`}
              style={{
                fontWeight: 700,
                fontSize: '11px',
                color: dftStats.isCompliant ? '#2E7D32' : '#C62828'
              }}
            >
              {dftVerdict || (dftStats.isCompliant ? 'PASS ✓' : dftStats.totalReadings > 0 ? 'REWORK ✗' : '—')}
            </span>
          </div>
        </div>
      </div>

      {/* Remark Box */}
      <div className="remark-box" style={{ marginTop: '14px' }}>
        <div className="remark-l">💬 Coat-Specific Remark</div>
        <textarea
          className="remark-t"
          id={`${sid}-remark`}
          rows={3}
          placeholder="Coat-specific remarks · defects observed · rework · client approval..."
          value={coatSheet.remark || ''}
          onChange={(e) => handleFieldChange('remark', e.target.value)}
        />
      </div>

      {/* Standard Button Row */}
      <div className="btn-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidateApprove}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        {nextStage && (
          <button
            type="button"
            className="btn nx"
            onClick={() => onNavigate && onNavigate('painter', nextStage.target)}
          >
            {nextStage.label}
          </button>
        )}
      </div>
    </div>
  );
}
