import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function ProcurementSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [currentTab, setCurrentTab] = useState('proc');

  useEffect(() => {
    if (activeSubTool === 'bid-comp' || activeSubTool === 'bid_comp' || activeSubTool === 'bid_comparison') {
      setCurrentTab('comp');
    } else {
      setCurrentTab('proc');
    }
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // BID-1: Paint Procurement Quantity (multi-coat)
  // ----------------------------------------------------
  const [ppqProj, setPpqProj] = useState('');
  const [ppqCli, setPpqCli] = useState('');
  const [ppqArea, setPpqArea] = useState('5000');
  const [ppqTe, setPpqTe] = useState('100');
  const [ppqLoss, setPpqLoss] = useState('15');
  const [ppqRes, setPpqRes] = useState('5');

  // Coat 1: Primer
  const [c1Nm, setC1Nm] = useState('Zinc Rich Epoxy Primer');
  const [c1Dft, setC1Dft] = useState('75');
  const [c1Vs, setC1Vs] = useState('65');
  const [c1Pr, setC1Pr] = useState('650');
  const [c1Pk, setC1Pk] = useState('20');

  // Coat 2: Intermediate
  const [c2Nm, setC2Nm] = useState('High Build Epoxy MIO');
  const [c2Dft, setC2Dft] = useState('150');
  const [c2Vs, setC2Vs] = useState('80');
  const [c2Pr, setC2Pr] = useState('480');
  const [c2Pk, setC2Pk] = useState('20');

  // Coat 3: Finish
  const [c3Nm, setC3Nm] = useState('Aliphatic Polyurethane');
  const [c3Dft, setC3Dft] = useState('50');
  const [c3Vs, setC3Vs] = useState('58');
  const [c3Pr, setC3Pr] = useState('720');
  const [c3Pk, setC3Pk] = useState('20');

  // Coat 4: Stripe Coat
  const [c4Nm, setC4Nm] = useState('Epoxy Stripe Coat');
  const [c4Dft, setC4Dft] = useState('50');
  const [c4Vs, setC4Vs] = useState('80');
  const [c4Pr, setC4Pr] = useState('480');
  const [c4Pk, setC4Pk] = useState('20');
  const [c4Sa, setC4Sa] = useState('15');

  const [hasPpqCalculated, setHasPpqCalculated] = useState(false);

  const areaVal = parseFloat(ppqArea) || 0;
  const teVal = parseFloat(ppqTe) || 100;
  const lossVal = parseFloat(ppqLoss) || 0;
  const resVal = parseFloat(ppqRes) || 0;

  const rawCoats = [
    { coat: 'Primer', nm: c1Nm, dft: parseFloat(c1Dft) || 0, vs: parseFloat(c1Vs) || 0, pr: parseFloat(c1Pr) || 0, pk: parseInt(c1Pk) || 20, saRatio: 1.0 },
    { coat: 'Intermediate', nm: c2Nm, dft: parseFloat(c2Dft) || 0, vs: parseFloat(c2Vs) || 0, pr: parseFloat(c2Pr) || 0, pk: parseInt(c2Pk) || 20, saRatio: 1.0 },
    { coat: 'Finish', nm: c3Nm, dft: parseFloat(c3Dft) || 0, vs: parseFloat(c3Vs) || 0, pr: parseFloat(c3Pr) || 0, pk: parseInt(c3Pk) || 20, saRatio: 1.0 },
    { coat: 'Stripe Coat', nm: c4Nm, dft: parseFloat(c4Dft) || 0, vs: parseFloat(c4Vs) || 0, pr: parseFloat(c4Pr) || 0, pk: parseInt(c4Pk) || 20, saRatio: (parseFloat(c4Sa) || 15) / 100 }
  ];

  const validCoats = [];
  let totQ = 0;
  let totP = 0;
  let totPk = 0;
  let totCost = 0;
  let anyCost = false;
  let totDft = 0;

  rawCoats.forEach((c, idx) => {
    if (c.dft > 0 && c.vs > 0) {
      const coatArea = areaVal * c.saRatio;
      const tc = (c.vs * 10) / c.dft;
      const pc = tc * (teVal / 100) * ((100 - lossVal) / 100);
      const q = pc > 0 ? coatArea / pc : 0;
      const proc = q * (1 + resVal / 100);
      const packs = c.pk > 0 ? Math.ceil(proc / c.pk) : 0;
      const supplied = packs * c.pk;
      const cost = c.pr > 0 ? supplied * c.pr : 0;
      if (c.pr > 0) anyCost = true;

      totQ += q;
      totP += proc;
      totPk += packs;
      totCost += cost;
      if (idx !== 3) totDft += c.dft;

      validCoats.push({
        ...c,
        coatArea,
        tc,
        pc,
        q,
        proc,
        packs,
        supplied,
        cost
      });
    }
  });

  // ----------------------------------------------------
  // BID-2: Multi-Manufacturer Bid Comparison
  // ----------------------------------------------------
  const [bidArea, setBidArea] = useState('5000');
  const [bidLoss, setBidLoss] = useState('15');
  const [bidWt, setBidWt] = useState('60');

  // New Bid Form Inputs
  const [bidMfr, setBidMfr] = useState('Jotun');
  const [bidCust, setBidCust] = useState('');
  const [bidProd, setBidProd] = useState('Zn Epoxy + MIO + PU');
  const [bidDft, setBidDft] = useState('250');
  const [bidVs, setBidVs] = useState('70');
  const [bidPr, setBidPr] = useState('650');
  const [bidQty, setBidQty] = useState('');
  const [bidVoc, setBidVoc] = useState('250');
  const [bidLife, setBidLife] = useState('15');
  const [bidTc, setBidTc] = useState('100');
  const [bidWar, setBidWar] = useState('5');
  const [bidPk, setBidPk] = useState('20');
  const [bidDry, setBidDry] = useState('4 h touch · 8 h recoat');
  const [bidApp, setBidApp] = useState('Airless spray');

  // Initial bids list preloaded for rich demonstration
  const [bids, setBids] = useState([
    {
      mfr: 'Jotun',
      prod: 'Barrier + Penguard Pro + Hardtop XP',
      dft: 250,
      vs: 72,
      pr: 680,
      qty: 2040,
      pk: 20,
      packs: 102,
      cost: 1387200,
      costM2: 277.4,
      life: 18,
      lcYr: 77067,
      voc: 230,
      tc: 100,
      war: 7,
      dry: '4 h touch · 8 h recoat',
      app: 'Airless spray'
    },
    {
      mfr: 'Hempel',
      prod: 'Hempadur Avantguard + Mastic + Polyenamel',
      dft: 250,
      vs: 68,
      pr: 620,
      qty: 2160,
      pk: 20,
      packs: 108,
      cost: 1339200,
      costM2: 267.8,
      life: 16,
      lcYr: 83700,
      voc: 260,
      tc: 98,
      war: 5,
      dry: '3 h touch · 6 h recoat',
      app: 'Airless spray'
    },
    {
      mfr: 'AkzoNobel',
      prod: 'Interzinc 52 + Intergard 475 + Interthane 990',
      dft: 250,
      vs: 70,
      pr: 710,
      qty: 2100,
      pk: 20,
      packs: 105,
      cost: 1491000,
      costM2: 298.2,
      life: 20,
      lcYr: 74550,
      voc: 210,
      tc: 100,
      war: 8,
      dry: '3.5 h touch · 7 h recoat',
      app: 'Airless spray'
    }
  ]);

  const bAreaVal = parseFloat(bidArea) || 0;
  const bLossVal = parseFloat(bidLoss) || 15;
  const wT = parseFloat(bidWt) || 60;
  const wC = 100 - wT;

  const bidNorm = (vals, invert) => {
    const mx = Math.max(...vals);
    const mn = Math.min(...vals);
    return vals.map(x => (mx === mn ? 100 : (invert ? (mx - x) / (mx - mn) : (x - mn) / (mx - mn)) * 100));
  };

  // Calculate scores
  const scoredBids = [...bids];
  if (scoredBids.length > 0) {
    const nComp = scoredBids.map(b => b.tc);
    const nLife = bidNorm(scoredBids.map(b => b.life), false);
    const nVS = bidNorm(scoredBids.map(b => b.vs), false);
    const nVOC = bidNorm(scoredBids.map(b => b.voc || 0), true);
    const nCost = bidNorm(scoredBids.map(b => b.costM2), true);
    const nLC = bidNorm(scoredBids.map(b => b.lcYr), true);

    scoredBids.forEach((b, i) => {
      b.tech = nComp[i] * 0.5 + nLife[i] * 0.25 + nVS[i] * 0.15 + nVOC[i] * 0.10;
      b.comm = nCost[i] * 0.6 + nLC[i] * 0.4;
      b.overall = (b.tech * wT) / 100 + (b.comm * wC) / 100;
    });
  }

  const ixMax = fn => scoredBids.reduce((bestIdx, x, i) => (fn(x) > fn(scoredBids[bestIdx]) ? i : bestIdx), 0);
  const ixMin = fn => scoredBids.reduce((bestIdx, x, i) => (fn(x) < fn(scoredBids[bestIdx]) ? i : bestIdx), 0);

  const iTech = scoredBids.length > 0 ? ixMax(b => b.tech) : 0;
  const iCost = scoredBids.length > 0 ? ixMin(b => b.cost) : 0;
  const iVal = scoredBids.length > 0 ? ixMax(b => b.overall) : 0;
  const iVOC = scoredBids.length > 0 ? ixMin(b => b.voc || 1e9) : 0;
  const iLife = scoredBids.length > 0 ? ixMax(b => b.life) : 0;

  const badges = scoredBids.map(() => []);
  if (scoredBids.length > 0) {
    badges[iTech].push('🥇 Best Technical');
    badges[iCost].push('💰 Lowest Cost');
    badges[iVal].push('⭐ Best Value');
    if (scoredBids.some(b => b.voc > 0)) badges[iVOC].push('🌱 Lowest VOC');
    badges[iLife].push('⏳ Longest Life');
    badges[iVal].push('🏆 RECOMMENDED');
  }

  const win = scoredBids.length > 0 ? scoredBids[iVal] : null;

  const handleAddBid = () => {
    if (bids.length >= 10) {
      addToast('Limit Reached', 'Maximum 10 bids. Clear the comparison to start again.', 'warning');
      return;
    }
    if (!bAreaVal) {
      addToast('Missing Surface Area', 'Fill common Surface Area in Section A first.', 'warning');
      return;
    }
    const dft = parseFloat(bidDft) || 0;
    const vs = parseFloat(bidVs) || 0;
    const pr = parseFloat(bidPr) || 0;
    const life = parseFloat(bidLife) || 0;

    if (!dft || !vs || !pr || !life) {
      addToast('Missing Inputs', 'Fill DFT, Volume Solids, Unit Price and Service Life.', 'warning');
      return;
    }

    let mfrName = bidMfr === 'Custom…' ? (bidCust.trim() || `Bid ${bids.length + 1}`) : bidMfr;
    if (bids.some(b => b.mfr === mfrName)) mfrName = `${mfrName} (${bids.length + 1})`;

    const qtyIn = parseFloat(bidQty);
    const pc = (vs * 10 / dft) * ((100 - bLossVal) / 100);
    const qty = qtyIn > 0 ? qtyIn : (pc > 0 ? bAreaVal / pc : 0);
    const pk = parseInt(bidPk) || 20;
    const packs = pk > 0 ? Math.ceil(qty / pk) : 0;
    const cost = qty * pr;
    const costM2 = bAreaVal > 0 ? cost / bAreaVal : 0;
    const lcYr = life > 0 ? cost / life : 0;

    const newBid = {
      mfr: mfrName,
      prod: bidProd || '—',
      dft,
      vs,
      pr,
      qty,
      pk,
      packs,
      cost,
      costM2,
      life,
      lcYr,
      voc: parseFloat(bidVoc) || 0,
      tc: parseFloat(bidTc) || 100,
      war: parseFloat(bidWar) || 0,
      dry: bidDry || '—',
      app: bidApp || '—'
    };

    setBids(prev => [...prev, newBid]);
    addToast('Bid Added', `Added bid from ${mfrName}. Total: ${bids.length + 1}`, 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'bid-comp',
      tool_name: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)',
      category: 'specialized',
      inputs: {
        surface_area_m2: bAreaVal,
        application_loss_pct: bLossVal,
        technical_weightage_pct: wT,
        commercial_weightage_pct: wC,
        manufacturer: mfrName,
        product: bidProd,
        dft_um: dft,
        volume_solids_pct: vs,
        price_per_liter_inr: pr,
        service_life_yrs: life
      },
      results: {
        total_quantity_l: qty,
        total_cost_inr: cost,
        cost_per_m2_inr: costM2,
        annualized_lifecycle_cost_inr: lcYr
      }
    });
  };

  const handleCalcPpq = () => {
    if (!areaVal || validCoats.length === 0) {
      addToast('Missing Required Inputs', 'Please enter Project Area and at least one coat with DFT and VS%.', 'warning');
      return;
    }
    setHasPpqCalculated(true);
    addToast('Procurement Calculated', `${formatNum(totP, 0)} L total procurement.`, 'success');
    autoLogCalculation({
      tool_id: 'bid-proc',
      tool_name: 'Paint Procurement Quantity (Multi-Coat Matrix)',
      category: 'specialized',
      inputs: {
        project: ppqProj,
        client: ppqCli,
        surface_area_m2: areaVal,
        transfer_efficiency_pct: teVal,
        application_loss_pct: lossVal,
        reserve_margin_pct: resVal,
        coats: validCoats.map(c => ({
          coat: c.coat,
          name: c.nm,
          dft_um: c.dft,
          volume_solids_pct: c.vs,
          unit_rate_inr_l: c.pr,
          pack_size_l: c.pk
        }))
      },
      results: {
        total_paint_required_l: totQ,
        total_procurement_quantity_l: totP,
        total_packs_required: totPk,
        total_paint_cost_inr: totCost,
        total_system_dft_um: totDft
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (!log) return;
      if (['bid-proc', 'bid_proc', 'paint_procurement', 'paint-procurement', 'procurement_suite'].includes(log.tool_id)) {
        setCurrentTab('proc');
        if (log.inputs) {
          if (log.inputs.project !== undefined) setPpqProj(log.inputs.project);
          if (log.inputs.client !== undefined) setPpqCli(log.inputs.client);
          if (log.inputs.surface_area_m2 !== undefined) setPpqArea(String(log.inputs.surface_area_m2));
          if (log.inputs.transfer_efficiency_pct !== undefined) setPpqTe(String(log.inputs.transfer_efficiency_pct));
          if (log.inputs.application_loss_pct !== undefined) setPpqLoss(String(log.inputs.application_loss_pct));
          if (log.inputs.reserve_margin_pct !== undefined) setPpqRes(String(log.inputs.reserve_margin_pct));
          if (Array.isArray(log.inputs.coats)) {
            log.inputs.coats.forEach(c => {
              if (c.coat === 'Primer') {
                if (c.name !== undefined) setC1Nm(c.name);
                if (c.dft_um !== undefined) setC1Dft(String(c.dft_um));
                if (c.volume_solids_pct !== undefined) setC1Vs(String(c.volume_solids_pct));
                if (c.unit_rate_inr_l !== undefined) setC1Pr(String(c.unit_rate_inr_l));
                if (c.pack_size_l !== undefined) setC1Pk(String(c.pack_size_l));
              } else if (c.coat === 'Intermediate') {
                if (c.name !== undefined) setC2Nm(c.name);
                if (c.dft_um !== undefined) setC2Dft(String(c.dft_um));
                if (c.volume_solids_pct !== undefined) setC2Vs(String(c.volume_solids_pct));
                if (c.unit_rate_inr_l !== undefined) setC2Pr(String(c.unit_rate_inr_l));
                if (c.pack_size_l !== undefined) setC2Pk(String(c.pack_size_l));
              } else if (c.coat === 'Finish') {
                if (c.name !== undefined) setC3Nm(c.name);
                if (c.dft_um !== undefined) setC3Dft(String(c.dft_um));
                if (c.volume_solids_pct !== undefined) setC3Vs(String(c.volume_solids_pct));
                if (c.unit_rate_inr_l !== undefined) setC3Pr(String(c.unit_rate_inr_l));
                if (c.pack_size_l !== undefined) setC3Pk(String(c.pack_size_l));
              } else if (c.coat === 'Stripe Coat') {
                if (c.name !== undefined) setC4Nm(c.name);
                if (c.dft_um !== undefined) setC4Dft(String(c.dft_um));
                if (c.volume_solids_pct !== undefined) setC4Vs(String(c.volume_solids_pct));
                if (c.unit_rate_inr_l !== undefined) setC4Pr(String(c.unit_rate_inr_l));
                if (c.pack_size_l !== undefined) setC4Pk(String(c.pack_size_l));
              }
            });
          }
        }
        setHasPpqCalculated(true);
      } else if (['bid-comp', 'bid_comp', 'bid_comparison'].includes(log.tool_id)) {
        setCurrentTab('comp');
        if (log.inputs) {
          if (log.inputs.surface_area_m2 !== undefined) setBidArea(String(log.inputs.surface_area_m2));
          if (log.inputs.application_loss_pct !== undefined) setBidLoss(String(log.inputs.application_loss_pct));
          if (log.inputs.technical_weightage_pct !== undefined) setBidWt(String(log.inputs.technical_weightage_pct));
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleClearBids = () => {
    setBids([]);
    addToast('Cleared', 'All bids cleared.', 'info');
  };

  const handleExportCSV = () => {
    if (bids.length === 0) {
      addToast('No Data', 'Add bids before exporting.', 'warning');
      return;
    }
    const headers = ['Manufacturer', 'Product', 'DFT (µm)', 'VS (%)', 'Price (₹/L)', 'Quantity (L)', 'Total Cost (₹)', '₹/m²', 'Life (yrs)', '₹/yr Lifecycle', 'Technical Score', 'Commercial Score', 'Overall Score'];
    const rows = [headers];
    scoredBids.forEach(b => {
      rows.push([
        b.mfr,
        b.prod,
        b.dft,
        b.vs,
        b.pr,
        formatNum(b.qty, 0),
        formatNum(b.cost, 0),
        formatNum(b.costM2, 1),
        b.life,
        formatNum(b.lcYr, 0),
        formatNum(b.tech, 1),
        formatNum(b.comm, 1),
        formatNum(b.overall, 1)
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Bid_Comparison_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Bid comparison exported to CSV.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Sub Navigation Bar matching exact pills */}
      <div className="subnav">
        <button
          className={`snb ${currentTab === 'proc' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('proc', 'paint_procurement')}
        >
          🛒 BID-1: Paint Procurement Quantity
        </button>
        <button
          className={`snb ${currentTab === 'comp' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('comp', 'bid_comparison')}
        >
          🏆 BID-2: Multi-Manufacturer Bid Comparison
        </button>
      </div>

      {/* ── BID-1 : Paint Procurement Quantity ── */}
      {currentTab === 'proc' && (
        <div className="sub-sec card active" id="bid-proc">
          <div className="ch">
            <div className="ci">🛒</div>
            <div>
              <div className="ct">Paint Procurement Quantity Calculator</div>
              <div className="cs">Multi-coat system — paint per coat · containers · reserve · total procurement cost</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('bid-proc')}>📖 Guideline</button>
            <div className="ctag">PRO · BID-1</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', marginBottom: '8px' }}>
                A · Project Data
              </div>
              <div className="g2">
                <div className="field">
                  <label>Project Name <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={ppqProj}
                      onChange={e => setPpqProj(e.target.value)}
                      placeholder="e.g. Tank Farm External"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Client / Structure <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={ppqCli}
                      onChange={e => setPpqCli(e.target.value)}
                      placeholder="e.g. BPCL — T-101/102"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={ppqArea}
                      onChange={e => setPpqArea(e.target.value)}
                      placeholder="e.g. 5000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Transfer Efficiency <span className="lh">% · airless ~ 70–90</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={ppqTe}
                      onChange={e => setPpqTe(e.target.value)}
                      min="10"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Application Loss <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={ppqLoss}
                      onChange={e => setPpqLoss(e.target.value)}
                      min="0"
                      max="90"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Procurement Reserve <span className="lh">% · contingency stock</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={ppqRes}
                      onChange={e => setPpqRes(e.target.value)}
                      min="0"
                      max="50"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
                B · Coating System (DFT = 0 skips a coat)
              </div>

              {/* Coat 1 — Primer */}
              <div className="g2" style={{ marginBottom: '4px' }}>
                <div className="field">
                  <label>Coat 1 — Primer <span className="lh">product · optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={c1Nm}
                      onChange={e => setC1Nm(e.target.value)}
                      placeholder="e.g. product name"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>DFT <span className="lh">µm · 0 = skip coat</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c1Dft}
                      onChange={e => setC1Dft(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Volume Solids <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c1Vs}
                      onChange={e => setC1Vs(e.target.value)}
                      min="1"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Unit Price <span className="lh">₹/L · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c1Pr}
                      onChange={e => setC1Pr(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Packing Size</label>
                  <div className="iw">
                    <select
                      value={c1Pk}
                      onChange={e => setC1Pk(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="20">20 L</option>
                      <option value="10">10 L</option>
                      <option value="5">5 L</option>
                      <option value="4">4 L</option>
                      <option value="1">1 L</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coat 2 — Intermediate */}
              <div className="g2" style={{ marginBottom: '4px' }}>
                <div className="field">
                  <label>Coat 2 — Intermediate <span className="lh">product · optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={c2Nm}
                      onChange={e => setC2Nm(e.target.value)}
                      placeholder="e.g. product name"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>DFT <span className="lh">µm · 0 = skip coat</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c2Dft}
                      onChange={e => setC2Dft(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Volume Solids <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c2Vs}
                      onChange={e => setC2Vs(e.target.value)}
                      min="1"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Unit Price <span className="lh">₹/L · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c2Pr}
                      onChange={e => setC2Pr(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Packing Size</label>
                  <div className="iw">
                    <select
                      value={c2Pk}
                      onChange={e => setC2Pk(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="20">20 L</option>
                      <option value="10">10 L</option>
                      <option value="5">5 L</option>
                      <option value="4">4 L</option>
                      <option value="1">1 L</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coat 3 — Finish */}
              <div className="g2" style={{ marginBottom: '4px' }}>
                <div className="field">
                  <label>Coat 3 — Finish <span className="lh">product · optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={c3Nm}
                      onChange={e => setC3Nm(e.target.value)}
                      placeholder="e.g. product name"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>DFT <span className="lh">µm · 0 = skip coat</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c3Dft}
                      onChange={e => setC3Dft(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Volume Solids <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c3Vs}
                      onChange={e => setC3Vs(e.target.value)}
                      min="1"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Unit Price <span className="lh">₹/L · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c3Pr}
                      onChange={e => setC3Pr(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Packing Size</label>
                  <div className="iw">
                    <select
                      value={c3Pk}
                      onChange={e => setC3Pk(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="20">20 L</option>
                      <option value="10">10 L</option>
                      <option value="5">5 L</option>
                      <option value="4">4 L</option>
                      <option value="1">1 L</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coat 4 — Stripe Coat */}
              <div className="g2" style={{ marginBottom: '4px' }}>
                <div className="field">
                  <label>Coat 4 — Stripe Coat <span className="lh">product · optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={c4Nm}
                      onChange={e => setC4Nm(e.target.value)}
                      placeholder="e.g. product name"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>DFT <span className="lh">µm · 0 = skip coat</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c4Dft}
                      onChange={e => setC4Dft(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Volume Solids <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c4Vs}
                      onChange={e => setC4Vs(e.target.value)}
                      min="1"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Unit Price <span className="lh">₹/L · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c4Pr}
                      onChange={e => setC4Pr(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Packing Size</label>
                  <div className="iw">
                    <select
                      value={c4Pk}
                      onChange={e => setC4Pk(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="20">20 L</option>
                      <option value="10">10 L</option>
                      <option value="5">5 L</option>
                      <option value="4">4 L</option>
                      <option value="1">1 L</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Stripe Area <span className="lh">% of total area</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={c4Sa}
                      onChange={e => setC4Sa(e.target.value)}
                      min="0"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcPpq}>
                ▶ Calculate Procurement Quantity
              </button>
              <button className="btn-reset" onClick={() => {
                setPpqProj(''); setPpqCli(''); setPpqArea(''); setPpqTe('100'); setPpqLoss('15'); setPpqRes('5');
                setC1Dft('0'); setC2Dft('0'); setC3Dft('0'); setC4Dft('0'); setHasPpqCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasPpqCalculated && areaVal > 0 && validCoats.length > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Procurement Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🛒 Total Procurement {formatNum(totP, 0)} L → {totPk} containers ({validCoats.length} coats · system {totDft} µm + stripe)
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Requirement {formatNum(totQ, 0)} L + {resVal}% reserve · TE {teVal}% · loss {lossVal}%{anyCost ? ` · Total cost ${formatCur(totCost)}` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Total Procurement Quantity</div>
                      <div><span className="tv">{formatNum(totP, 0)}</span><span className="tu">L</span></div>
                      <div className="tn">incl. {resVal}% reserve</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Total Paint Requirement</div>
                      <div><span className="tv">{formatNum(totQ, 0)}</span><span className="tu">L</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Total Containers</div>
                      <div><span className="tv">{totPk}</span><span className="tu">packs</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Total Procurement Cost</div>
                      <div><span className="tv" style={{ fontSize: '22px' }}>{anyCost ? formatCur(totCost) : '—'}</span></div>
                      <div className="tn">{anyCost ? `${formatCur(totCost / areaVal)}/m² (supplied basis)` : 'Enter unit prices'}</div>
                    </div>
                  </div>

                  {/* Detail Table */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                      Detail Table — Coat · DFT · Coverage · Paint · Procurement · Packs
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', background: 'var(--bg3)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '7px 9px', textAlign: 'left', background: 'var(--bg4)', fontSize: '9.5px', letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--in-lbl)' }}>Coat</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>DFT µm</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>VS %</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Area m²</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Practical m²/L</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Paint L</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Proc. L</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Pack</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Packs</th>
                            <th style={{ padding: '7px 9px', textAlign: 'right', background: 'var(--bg4)', fontSize: '9.5px', color: 'var(--in-lbl)' }}>Cost ₹</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validCoats.map((r, idx) => (
                            <tr key={idx}>
                              <td style={{ padding: '6px 9px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--bdr)' }}>
                                {r.coat}
                                <div style={{ fontSize: '9.5px', color: 'var(--txt3)' }}>{r.nm}</div>
                              </td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{r.dft}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{r.vs}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(r.coatArea, 0)}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(r.pc, 2)}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(r.q, 1)}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(r.proc, 1)}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{r.pk} L</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', fontWeight: 700, borderBottom: '1px solid var(--bdr)' }}>{r.packs}</td>
                              <td style={{ padding: '6px 9px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{r.cost > 0 ? formatNum(r.cost, 0) : '—'}</td>
                            </tr>
                          ))}
                          <tr>
                            <td style={{ padding: '7px 9px', fontWeight: 800, color: 'var(--brand-crimson)' }}>TOTAL</td>
                            <td colSpan={4}></td>
                            <td style={{ padding: '7px 9px', textAlign: 'right', fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(totQ, 1)}</td>
                            <td style={{ padding: '7px 9px', textAlign: 'right', fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(totP, 1)}</td>
                            <td></td>
                            <td style={{ padding: '7px 9px', textAlign: 'right', fontWeight: 800, color: 'var(--brand-crimson)' }}>{totPk}</td>
                            <td style={{ padding: '7px 9px', textAlign: 'right', fontWeight: 800, color: 'var(--brand-crimson)' }}>{anyCost ? formatNum(totCost, 0) : '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Project</span><span className="dv">{ppqProj || '—'}</span></div>
                    <div className="dr"><span className="dk">Client / Structure</span><span className="dv">{ppqCli || '—'}</span></div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(areaVal, 0)} m²</span></div>
                    <div className="dr"><span className="dk">Transfer Efficiency / Loss / Reserve</span><span className="dv">{teVal}% / {lossVal}% / {resVal}%</span></div>
                    <div className="dr"><span className="dk">Coats</span><span className="dv">{validCoats.map(r => `${r.coat} ${r.dft}µm`).join(' + ')}</span></div>
                    <div className="dr"><span className="dk">Total Requirement</span><span className="dv">{formatNum(totQ, 1)} L</span></div>
                    <div className="dr"><span className="dk">Total Procurement</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(totP, 1)} L → {totPk} containers</span></div>
                    <div className="dr"><span className="dk">Total Cost</span><span className="dv">{anyCost ? formatCur(totCost) : '—'}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 12944 · NORSOK M-501 · AMPP/SSPC Guidelines · API RP 652/651 · Project Paint Specification
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Total Procurement: ${formatNum(totP, 0)} L (${totPk} containers) for ${formatNum(areaVal, 0)} m².`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BID-2 : Multi-Manufacturer Bid Comparison ── */}
      {currentTab === 'comp' && (
        <div className="sub-sec card active" id="bid-comp">
          <div className="ch">
            <div className="ci">🏆</div>
            <div>
              <div className="ct">Multi-Manufacturer Bid Comparison</div>
              <div className="cs">Compare up to 10 bids — technical &amp; commercial scoring · badges · interactive charts</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('bid-comp')}>📖 Guideline</button>
            <div className="ctag">PRO · BID-2</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', marginBottom: '8px' }}>
                A · Common Project Basis (shared by all bids)
              </div>
              <div className="g2">
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidArea}
                      onChange={e => setBidArea(e.target.value)}
                      placeholder="e.g. 5000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Application Loss <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidLoss}
                      onChange={e => setBidLoss(e.target.value)}
                      min="0"
                      max="90"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Score Weighting <span className="lh">Technical : Commercial</span></label>
                  <div className="iw">
                    <select
                      value={bidWt}
                      onChange={e => setBidWt(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="60">60 : 40 (QCBS default)</option>
                      <option value="70">70 : 30 (technical priority)</option>
                      <option value="50">50 : 50 (balanced)</option>
                      <option value="40">40 : 60 (cost priority)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
                B · Enter Bid (then “Add Bid” — repeat up to 10)
              </div>
              <div className="g2">
                <div className="field">
                  <label>Manufacturer</label>
                  <div className="iw">
                    <select
                      value={bidMfr}
                      onChange={e => setBidMfr(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option>Jotun</option>
                      <option>AkzoNobel</option>
                      <option>Hempel</option>
                      <option>PPG</option>
                      <option>Sherwin-Williams</option>
                      <option>Nippon Paint</option>
                      <option>Kansai</option>
                      <option>Berger</option>
                      <option>Asian Paints</option>
                      <option>Indigo</option>
                      <option>Custom…</option>
                    </select>
                  </div>
                </div>
                {bidMfr === 'Custom…' && (
                  <div className="field">
                    <label>Custom Manufacturer / Bid Name</label>
                    <div className="iw">
                      <input
                        type="text"
                        value={bidCust}
                        onChange={e => setBidCust(e.target.value)}
                        placeholder="e.g. Grand Polycoats"
                      />
                    </div>
                  </div>
                )}
                <div className="field">
                  <label>Product / Coating System <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={bidProd}
                      onChange={e => setBidProd(e.target.value)}
                      placeholder="e.g. Zn Epoxy + MIO + PU"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Total System DFT <span className="lh">µm</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidDft}
                      onChange={e => setBidDft(e.target.value)}
                      placeholder="e.g. 250"
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Volume Solids (system avg) <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidVs}
                      onChange={e => setBidVs(e.target.value)}
                      placeholder="e.g. 70"
                      min="1"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Unit Price <span className="lh">₹/L</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidPr}
                      onChange={e => setBidPr(e.target.value)}
                      placeholder="e.g. 650"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Paint Quantity <span className="lh">L · blank = auto from DFT/VS/area</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidQty}
                      onChange={e => setBidQty(e.target.value)}
                      placeholder="Auto"
                      min="0"
                      step="any"
                    />
                    <span className="uu">L</span>
                  </div>
                </div>
                <div className="field">
                  <label>VOC <span className="lh">g/L</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidVoc}
                      onChange={e => setBidVoc(e.target.value)}
                      placeholder="e.g. 250"
                      min="0"
                      step="any"
                    />
                    <span className="uu">g/L</span>
                  </div>
                </div>
                <div className="field">
                  <label>Expected Service Life <span className="lh">years</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidLife}
                      onChange={e => setBidLife(e.target.value)}
                      placeholder="e.g. 15"
                      min="1"
                      step="any"
                    />
                    <span className="uu">yrs</span>
                  </div>
                </div>
                <div className="field">
                  <label>Technical Compliance <span className="lh">% vs spec</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidTc}
                      onChange={e => setBidTc(e.target.value)}
                      min="0"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Warranty <span className="lh">years</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={bidWar}
                      onChange={e => setBidWar(e.target.value)}
                      placeholder="e.g. 5"
                      min="0"
                      step="any"
                    />
                    <span className="uu">yrs</span>
                  </div>
                </div>
                <div className="field">
                  <label>Packing Size</label>
                  <div className="iw">
                    <select
                      value={bidPk}
                      onChange={e => setBidPk(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="20">20 L</option>
                      <option value="10">10 L</option>
                      <option value="5">5 L</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Drying / Recoat <span className="lh">optional text</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={bidDry}
                      onChange={e => setBidDry(e.target.value)}
                      placeholder="e.g. 4 h touch · 8 h recoat"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Application Method <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={bidApp}
                      onChange={e => setBidApp(e.target.value)}
                      placeholder="e.g. Airless spray"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleAddBid}>➕ Add Bid to Comparison</button>
              <button className="btn-reset" onClick={handleClearBids}>🗑 Clear All Bids</button>
              <button className="btn-print" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleExportCSV}>⬇ Download Excel</button>
            </div>

            {scoredBids.length > 0 && win && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Final Bid Comparison Dashboard</div>

                  {/* Verdict Banner */}
                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🏆 Recommended: {win.mfr} — Overall Score {formatNum(win.overall, 1)}/100
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      {scoredBids.length} bid(s) compared · weighting {wT}:{wC} (Tech:Comm) · {win.mfr} — {formatCur(win.cost)} total · {formatCur(win.costM2)}/m² · {win.life} yr life · {formatCur(win.lcYr)}/yr lifecycle
                    </div>
                  </div>

                  {/* Ranked Bid Cards */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {[...scoredBids]
                      .map((b, i) => ({ b, i }))
                      .sort((x, y) => y.b.overall - x.b.overall)
                      .map(({ b, i }, rank) => {
                        const isW = i === iVal;
                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              minWidth: '210px',
                              borderRadius: 'var(--r2)',
                              padding: '12px 14px',
                              background: isW ? 'linear-gradient(135deg,#241813,#3A1418)' : 'var(--bg3)',
                              border: isW ? '1.5px solid var(--brand-gold)' : '1px solid var(--bdr)',
                              boxShadow: isW ? '0 4px 14px rgba(165,0,33,.3)' : 'none',
                              color: isW ? '#fff' : 'var(--txt)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '15px', fontWeight: 800 }}>
                                {rank + 1}. {b.mfr}
                              </div>
                              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 800, color: isW ? 'var(--brand-gold)' : 'var(--brand-crimson)' }}>
                                {formatNum(b.overall, 0)}
                              </div>
                            </div>
                            <div style={{ fontSize: '10px', color: isW ? 'rgba(255,255,255,.65)' : 'var(--txt3)' }}>
                              {b.prod !== '—' ? b.prod : ''}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '6px 0' }}>
                              {badges[i].map((bg, bIdx) => (
                                <span
                                  key={bIdx}
                                  style={{
                                    fontSize: '8.5px',
                                    fontWeight: 800,
                                    letterSpacing: '.5px',
                                    padding: '2.5px 7px',
                                    borderRadius: '10px',
                                    background: isW ? 'var(--brand-gold)' : 'var(--brand-orange)',
                                    color: '#241813'
                                  }}
                                >
                                  {bg}
                                </span>
                              ))}
                            </div>
                            <div style={{ fontSize: '10.5px', lineHeight: 1.9, color: isW ? 'rgba(255,255,255,.85)' : 'var(--txt2)' }}>
                              Total: <strong>{formatCur(b.cost)}</strong> · {formatCur(b.costM2)}/m²<br />
                              Qty: {formatNum(b.qty, 0)} L ({b.packs} × {b.pk} L) · Life: {b.life} yr<br />
                              Tech {formatNum(b.tech, 0)} · Comm {formatNum(b.comm, 0)} · LC {formatCur(b.lcYr)}/yr
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Interactive Comparison Table */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                      Interactive Comparison Table
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', background: 'var(--bg3)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '7px 9px', textAlign: 'left', background: 'var(--bg4)', fontSize: '9.5px', letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', whiteSpace: 'nowrap' }}>
                              Parameter
                            </th>
                            {scoredBids.map((b, i) => (
                              <th
                                key={i}
                                style={{
                                  padding: '7px 9px',
                                  textAlign: 'left',
                                  background: i === iVal ? '#C8E6C9' : 'var(--bg4)',
                                  color: i === iVal ? '#1B5E20' : 'var(--in-lbl)',
                                  fontSize: '9.5px',
                                  letterSpacing: '.5px',
                                  textTransform: 'uppercase',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {b.mfr}{i === iVal ? ' 🏆' : ''}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Product', fn: b => b.prod, align: 'left' },
                            { name: 'DFT µm', fn: b => b.dft },
                            { name: 'VS %', fn: b => b.vs },
                            { name: 'Unit ₹/L', fn: b => formatNum(b.pr, 0) },
                            { name: 'Qty L', fn: b => formatNum(b.qty, 0) },
                            { name: 'Packs', fn: b => `${b.packs} × ${b.pk}L`, align: 'left' },
                            { name: 'Total Cost ₹', fn: b => formatNum(b.cost, 0), bestIdx: iCost },
                            { name: '₹ / m²', fn: b => formatNum(b.costM2, 1), bestIdx: ixMin(x => x.costM2) },
                            { name: 'VOC g/L', fn: b => b.voc || '—', bestIdx: scoredBids.some(x => x.voc > 0) ? iVOC : -1 },
                            { name: 'Life yrs', fn: b => b.life, bestIdx: iLife },
                            { name: '₹/yr lifecycle', fn: b => formatNum(b.lcYr, 0), bestIdx: ixMin(x => x.lcYr) },
                            { name: 'Compliance %', fn: b => b.tc },
                            { name: 'Warranty yrs', fn: b => b.war || '—' },
                            { name: 'Drying/Recoat', fn: b => b.dry, align: 'left' },
                            { name: 'Application', fn: b => b.app, align: 'left' },
                            { name: 'Tech Score', fn: b => formatNum(b.tech, 1), bestIdx: iTech },
                            { name: 'Comm Score', fn: b => formatNum(b.comm, 1), bestIdx: ixMax(x => x.comm) },
                            { name: 'OVERALL', fn: b => formatNum(b.overall, 1), bestIdx: iVal }
                          ].map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td style={{ padding: '5px 9px', borderBottom: '1px solid var(--bdr)', fontWeight: 600, color: 'var(--txt2)', whiteSpace: 'nowrap' }}>
                                {row.name}
                              </td>
                              {scoredBids.map((b, i) => {
                                const isBest = row.bestIdx !== undefined && row.bestIdx === i;
                                return (
                                  <td
                                    key={i}
                                    style={{
                                      padding: '5px 9px',
                                      borderBottom: '1px solid var(--bdr)',
                                      textAlign: row.align === 'left' ? 'left' : 'right',
                                      fontWeight: isBest ? 800 : 500,
                                      color: isBest ? '#1B5E20' : 'var(--txt)'
                                    }}
                                  >
                                    {row.fn(b)}{isBest ? ' ✓' : ''}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--txt3)', marginTop: '4px' }}>
                      ✓ = best in row · green column = recommended bid
                    </div>
                  </div>

                  {/* Graphical Dashboard */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                      Graphical Dashboard
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '10px' }}>
                      {[
                        { title: '🏆 Overall Score (higher = better)', fn: b => b.overall, fmt: x => `${formatNum(x, 1)} /100`, invert: false },
                        { title: '💰 Total Project Cost (lower = better)', fn: b => b.cost, fmt: x => formatCur(x), invert: true },
                        { title: '📐 Cost per m² (lower = better)', fn: b => b.costM2, fmt: x => formatCur(x), invert: true },
                        { title: '🪣 Paint Quantity Required', fn: b => b.qty, fmt: x => `${formatNum(x, 0)} L`, invert: true },
                        { title: '⏳ Service Life (higher = better)', fn: b => b.life, fmt: x => `${x} yrs`, invert: false },
                        { title: '🔄 Lifecycle Cost ₹/yr (lower = better)', fn: b => b.lcYr, fmt: x => formatCur(x), invert: true },
                        { title: '🧪 Technical Score', fn: b => b.tech, fmt: x => formatNum(x, 1), invert: false }
                      ].map((item, cIdx) => {
                        const mx = Math.max(...scoredBids.map(item.fn), 1);
                        return (
                          <div key={cIdx} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: '10px 12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--txt2)', marginBottom: '7px' }}>
                              {item.title}
                            </div>
                            {scoredBids.map((b, i) => {
                              const val = item.fn(b);
                              const isBest = item.invert
                                ? val === Math.min(...scoredBids.map(item.fn))
                                : val === Math.max(...scoredBids.map(item.fn));
                              return (
                                <div key={i} title={`${b.mfr}: ${item.fmt(val)}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                  <div style={{ width: '100px', fontSize: '10px', fontWeight: 700, color: i === iVal ? 'var(--brand-crimson)' : 'var(--txt2)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {b.mfr}
                                  </div>
                                  <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: '12px', height: '15px', overflow: 'hidden', border: '1px solid var(--bdr)' }}>
                                    <div
                                      style={{
                                        width: `${(val / mx) * 100}%`,
                                        height: '100%',
                                        borderRadius: '12px',
                                        background: isBest
                                          ? 'linear-gradient(90deg,#66BB6A,#2E7D32)'
                                          : (i === iVal
                                            ? 'linear-gradient(90deg,var(--brand-gold),var(--brand-crimson))'
                                            : 'linear-gradient(90deg,#90A4AE,#546E7A)'),
                                        transition: 'width .5s'
                                      }}
                                    />
                                  </div>
                                  <div style={{ width: '92px', fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', fontWeight: 700 }}>
                                    {item.fmt(val)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendation Narrative */}
                  <div style={{ marginTop: '12px', padding: '12px 14px', background: '#E8F5E9', border: '1px solid rgba(46,125,50,.3)', borderLeft: '3px solid #2E7D32', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.8 }}>
                    <strong style={{ color: '#1B5E20' }}>🏆 Procurement Recommendation — {win.mfr}:</strong>{' '}
                    Ranked first with an overall score of {formatNum(win.overall, 1)}/100 at {wT}:{wC} technical-to-commercial weighting. Total supply {formatNum(win.qty, 0)} L ({win.packs} × {win.pk} L) at {formatCur(win.cost)} — {formatCur(win.costM2)}/m² and {formatCur(win.lcYr)}/yr over a {win.life}-year service life. Verify final award against complete technical submittals, track record, delivery, and commercial terms.
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>Scoring:</strong> Technical = compliance 50% + service life 25% + volume solids 15% + low VOC 10% (normalised across bids) · Commercial = low cost/m² 60% + low lifecycle ₹/yr 40% · Overall per selected weighting. References: ISO 12944 · NORSOK M-501 · AMPP/SSPC · API RP 652/651 · Project Specification.
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Recommended Bid: ${win.mfr} with score ${formatNum(win.overall, 1)}/100. Total: ${formatCur(win.cost)}`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={handleExportCSV}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn" onClick={handleExportCSV}>📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
