/**
 * Verified Industrial Surface & Coating Calculation Formulas
 */

export function calculateTankShell(diameter, height, volumeSolids, dft, lossPct) {
  const areaM2 = Math.PI * diameter * height;
  const areaSqFt = areaM2 * 10.7639;

  const theoreticalCoverage = (volumeSolids * 10.0) / (dft || 1);
  const theoreticalLiters = areaM2 / (theoreticalCoverage || 1);

  const lossFactor = Math.max(0, Math.min(95, lossPct)) / 100.0;
  const practicalLiters = lossFactor < 1.0 ? theoreticalLiters / (1.0 - lossFactor) : theoreticalLiters;
  const practicalGallons = practicalLiters / 3.78541;

  return {
    surfaceAreaM2: Number(areaM2.toFixed(2)),
    surfaceAreaSqFt: Number(areaSqFt.toFixed(2)),
    theoreticalCoverageM2PerL: Number(theoreticalCoverage.toFixed(2)),
    theoreticalLiters: Number(theoreticalLiters.toFixed(2)),
    practicalLiters: Number(practicalLiters.toFixed(2)),
    practicalGallons: Number(practicalGallons.toFixed(2)),
    lossPercentage: lossPct
  };
}

export function calculateTankRoof(roofType, diameter, roofHeight, volumeSolids, dft, lossPct) {
  const radius = diameter / 2.0;
  let areaM2 = 0;

  if (roofType === 'conical') {
    const slantHeight = Math.sqrt(radius ** 2 + roofHeight ** 2);
    areaM2 = Math.PI * radius * slantHeight;
  } else if (roofType === 'dome') {
    areaM2 = Math.PI * (radius ** 2 + roofHeight ** 2);
  } else {
    areaM2 = Math.PI * (radius ** 2);
  }

  const areaSqFt = areaM2 * 10.7639;
  const theoreticalCoverage = (volumeSolids * 10.0) / (dft || 1);
  const theoreticalLiters = areaM2 / (theoreticalCoverage || 1);
  const lossFactor = Math.max(0, Math.min(95, lossPct)) / 100.0;
  const practicalLiters = lossFactor < 1.0 ? theoreticalLiters / (1.0 - lossFactor) : theoreticalLiters;

  return {
    roofType,
    surfaceAreaM2: Number(areaM2.toFixed(2)),
    surfaceAreaSqFt: Number(areaSqFt.toFixed(2)),
    theoreticalLiters: Number(theoreticalLiters.toFixed(2)),
    practicalLiters: Number(practicalLiters.toFixed(2)),
    practicalGallons: Number((practicalLiters / 3.78541).toFixed(2))
  };
}

export function calculatePipeSpool(outerDiameterMm, lengthM, quantity, volumeSolids, dft, lossPct) {
  const outerDiameterM = outerDiameterMm / 1000.0;
  const singleAreaM2 = Math.PI * outerDiameterM * lengthM;
  const totalAreaM2 = singleAreaM2 * quantity;
  const totalAreaSqFt = totalAreaM2 * 10.7639;

  const theoreticalCoverage = (volumeSolids * 10.0) / (dft || 1);
  const theoreticalLiters = totalAreaM2 / (theoreticalCoverage || 1);
  const lossFactor = Math.max(0, Math.min(95, lossPct)) / 100.0;
  const practicalLiters = lossFactor < 1.0 ? theoreticalLiters / (1.0 - lossFactor) : theoreticalLiters;

  return {
    outerDiameterMm,
    lengthM,
    quantity,
    totalAreaM2: Number(totalAreaM2.toFixed(2)),
    totalAreaSqFt: Number(totalAreaSqFt.toFixed(2)),
    theoreticalLiters: Number(theoreticalLiters.toFixed(2)),
    practicalLiters: Number(practicalLiters.toFixed(2))
  };
}

export function calculateAbrasiveBlasting(surfaceAreaM2, abrasiveType = 'garnet', initialCondition = 'B') {
  const rates = {
    garnet: 18.0,
    copper_slag: 30.0,
    steel_grit: 12.0,
    aluminum_oxide: 22.0
  };

  const conditionMultipliers = { A: 1.0, B: 1.1, C: 1.25, D: 1.4 };

  const rate = rates[abrasiveType] || 20.0;
  const mult = conditionMultipliers[initialCondition] || 1.1;

  const totalKg = surfaceAreaM2 * rate * mult;
  const metricTons = totalKg / 1000.0;
  const nozzleHours = surfaceAreaM2 / 12.0;

  return {
    surfaceAreaM2: Number(surfaceAreaM2.toFixed(2)),
    abrasiveType,
    initialCondition,
    consumptionKg: Number(totalKg.toFixed(2)),
    consumptionMetricTons: Number(metricTons.toFixed(3)),
    estimatedNozzleHours: Number(nozzleHours.toFixed(1))
  };
}
