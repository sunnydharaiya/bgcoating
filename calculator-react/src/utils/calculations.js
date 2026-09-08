// Pure calculation algorithms extracted from BG CoatingOS™ reference system

export function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatCur(val, currency = '₹') {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${currency} ${Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// ── Paint Suite Formulas ──
export function calcWFTRange(minDft, maxDft, vsPercent, thinnerPercent = 0) {
  if (!vsPercent || vsPercent <= 0) return null;
  const factor = (100 + Number(thinnerPercent)) / Number(vsPercent);
  const minWft = Number(minDft) * factor;
  const maxWft = Number(maxDft) * factor;
  return { minWft, maxWft };
}

export function calcDFT(wft, vsPercent, thinnerPercent = 0) {
  if (!vsPercent || vsPercent <= 0 || !wft) return null;
  const dft = (Number(wft) * Number(vsPercent)) / (100 + Number(thinnerPercent));
  return dft;
}

export function calcCoverage(vsPercent, dft, lossPercent = 0, totalArea = 0, coats = 1) {
  if (!dft || dft <= 0 || !vsPercent || vsPercent <= 0) return null;
  const theoCoverage = (Number(vsPercent) * 10) / Number(dft); // m²/L
  const practCoverage = theoCoverage * (1 - Number(lossPercent) / 100);
  const theoSqFtGal = theoCoverage * 40.7458;
  const practSqFtGal = practCoverage * 40.7458;

  let totalLiters = null;
  if (totalArea > 0) {
    totalLiters = (Number(totalArea) * Number(coats)) / practCoverage;
  }

  return { theoCoverage, practCoverage, theoSqFtGal, practSqFtGal, totalLiters };
}

export function calcPaintConsumption(area, dft, vsPercent, lossPercent = 0, coats = 1) {
  if (!area || !dft || !vsPercent || vsPercent <= 0) return null;
  const theoLitersPerCoat = (Number(area) * Number(dft)) / (Number(vsPercent) * 10);
  const practLitersPerCoat = theoLitersPerCoat / (1 - Number(lossPercent) / 100);
  const totalTheoLiters = theoLitersPerCoat * Number(coats);
  const totalPractLiters = practLitersPerCoat * Number(coats);
  const lossLiters = totalPractLiters - totalTheoLiters;
  return { theoLitersPerCoat, practLitersPerCoat, totalTheoLiters, totalPractLiters, lossLiters };
}

export function calcBlastingLoss(area, rzRoughness, vsPercent, dvcCoefficient = 0.5) {
  if (!area || !rzRoughness || !vsPercent || vsPercent <= 0) return null;
  // Dead volume loss (L) = (Area m² × Rz µm × DVC) / (VS% × 100)
  const deadVolumeLiters = (Number(area) * Number(rzRoughness) * Number(dvcCoefficient)) / (Number(vsPercent) * 100);
  const extraMicrons = Number(rzRoughness) * Number(dvcCoefficient);
  return { deadVolumeLiters, extraMicrons };
}

export function calcMixingRatio(totalLitres, ratioA, ratioB, thinnerPercent = 0) {
  if (!totalLitres || !ratioA || !ratioB) return null;
  const sumRatio = Number(ratioA) + Number(ratioB);
  const partAVolume = Number(totalLitres) * (Number(ratioA) / sumRatio);
  const partBVolume = Number(totalLitres) * (Number(ratioB) / sumRatio);
  const thinnerVolume = Number(totalLitres) * (Number(thinnerPercent) / 100);
  const totalMixVolume = Number(totalLitres) + thinnerVolume;
  return { partAVolume, partBVolume, thinnerVolume, totalMixVolume };
}

export function calcCostPerArea(area, paintLiters, paintPricePerL, thinnerLiters = 0, thinnerPricePerL = 0) {
  if (!area || area <= 0) return null;
  const paintCost = Number(paintLiters || 0) * Number(paintPricePerL || 0);
  const thinnerCost = Number(thinnerLiters || 0) * Number(thinnerPricePerL || 0);
  const totalCost = paintCost + thinnerCost;
  const costPerSqM = totalCost / Number(area);
  const costPerSqFt = costPerSqM / 10.7639;
  return { paintCost, thinnerCost, totalCost, costPerSqM, costPerSqFt };
}

// ── Surface Area Geometry Formulas ──
export function calcPipeArea(lengthM, outerDiaMm, wallThkMm = 0, qty = 1) {
  const odM = Number(outerDiaMm) / 1000;
  const idM = (Number(outerDiaMm) - 2 * Number(wallThkMm)) / 1000;
  const len = Number(lengthM) * Number(qty);

  const outsideArea = Math.PI * odM * len;
  const insideArea = idM > 0 ? Math.PI * idM * len : 0;
  const endThicknessArea = wallThkMm > 0 ? 2 * Number(qty) * (Math.PI * (odM ** 2 - idM ** 2) / 4) : 0;
  const totalArea = outsideArea + insideArea + endThicknessArea;
  return { outsideArea, insideArea, endThicknessArea, totalArea };
}

export function calcTankArea(diameterM, heightM, roofType = 'conical', roofSlopeDeg = 15) {
  const d = Number(diameterM);
  const h = Number(heightM);
  const r = d / 2;

  const shellOutside = Math.PI * d * h;
  const shellInside = shellOutside;
  const bottomArea = Math.PI * (r ** 2);

  let roofArea = bottomArea;
  if (roofType === 'conical') {
    const slopeRad = (Number(roofSlopeDeg) * Math.PI) / 180;
    roofArea = bottomArea / Math.cos(slopeRad);
  } else if (roofType === 'dome') {
    roofArea = 2 * Math.PI * (r ** 2); // approximate hemispherical/dome
  }

  const totalExternal = shellOutside + roofArea;
  const totalInternal = shellInside + bottomArea + (roofType === 'floating' ? 0 : roofArea);
  const grandTotal = totalExternal + totalInternal;

  return { shellOutside, shellInside, bottomArea, roofArea, totalExternal, totalInternal, grandTotal };
}

export function calcPlateArea(lengthM, widthM, thkMm = 0, sides = 2, qty = 1) {
  const l = Number(lengthM);
  const w = Number(widthM);
  const tM = Number(thkMm) / 1000;
  const q = Number(qty);

  const faceArea = l * w * q * Number(sides);
  const edgeArea = tM > 0 ? 2 * (l + w) * tM * q : 0;
  const totalArea = faceArea + edgeArea;
  const steelWeightKg = l * w * (Number(thkMm) || 0) * 7.85 * q;

  return { faceArea, edgeArea, totalArea, steelWeightKg };
}

export function calcDishedEndArea(diameterM, thkMm = 0, headType = 'semi_ellipsoidal', qty = 1) {
  const d = Number(diameterM);
  const q = Number(qty);
  let singleArea = 0;

  if (headType === 'hemispherical') {
    singleArea = 2 * Math.PI * ((d / 2) ** 2);
  } else if (headType === 'semi_ellipsoidal') {
    singleArea = 1.084 * (d ** 2); // 2:1 Ellipsoidal standard ASME norm
  } else if (headType === 'torispherical') {
    singleArea = 0.929 * (d ** 2); // Standard ASME Torispherical 6% knuckle
  }

  const totalArea = singleArea * q;
  return { singleArea, totalArea };
}

export function calcVesselArea(shellDiaM, shellLengthM, headType = 'semi_ellipsoidal', headsCount = 2, contingencyPercent = 10) {
  const d = Number(shellDiaM);
  const l = Number(shellLengthM);
  const shellArea = Math.PI * d * l;

  const headCalc = calcDishedEndArea(d, 0, headType, headsCount);
  const headsArea = headCalc.totalArea;

  const baseArea = shellArea + headsArea;
  const allowanceArea = baseArea * (Number(contingencyPercent) / 100);
  const grandTotal = baseArea + allowanceArea;

  return { shellArea, headsArea, baseArea, allowanceArea, grandTotal };
}

// ── Salt Contamination ISO 8502-9 ──
export function calcBresleSalt(blankConductivity, surfaceConductivity, waterVolumeMl = 3, tempCelsius = 25, limitMgM2 = 20) {
  const rawDiff = Math.max(0, Number(surfaceConductivity) - Number(blankConductivity));
  // Temperature correction factor fT (normalizing to 25°C)
  // Approximate standard: ft = 1 / (1 + 0.02 * (T - 25))
  const ft = 1 / (1 + 0.0191 * (Number(tempCelsius) - 25));
  const correctedConductivity = rawDiff * ft;

  // For 12.5 cm² Bresle patch with standard 3 ml water:
  // Salt (mg/m²) = Corrected µS/cm × (waterVolume / 3) × 1.0 (approximate factor per ISO 8502-9)
  const saltMgM2 = correctedConductivity * (Number(waterVolumeMl) / 3) * 1.0;
  const saltUgCm2 = saltMgM2 / 10;
  const isPass = saltMgM2 <= Number(limitMgM2);

  return { rawDiff, ft, correctedConductivity, saltMgM2, saltUgCm2, isPass };
}
