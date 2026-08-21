import math


def calculate_tank_shell(diameter, height, volume_solids, dft, loss_pct, unit_system='metric'):
    """
    Calculates storage tank shell surface area, theoretical paint requirement,
    and practical paint volume considering application loss percentage.
    
    Unit system: 'metric' (meters, microns, m²) or 'imperial' (feet, mils, sq ft).
    """
    if unit_system == 'imperial':
        # Convert feet to meters for internal calculation, or compute direct imperial
        # Imperial: Area (sq ft) = PI * Diameter (ft) * Height (ft)
        area_sq_ft = math.pi * diameter * height
        area_m2 = area_sq_ft * 0.092903
    else:
        area_m2 = math.pi * diameter * height
        area_sq_ft = area_m2 * 10.7639

    # Coverage: 1 Liter at 100% VS covers 10 m² at 100 microns (1000 / DFT)
    # Theoretical coverage (m²/liter) = (VS% * 10) / DFT
    theoretical_coverage_m2_l = (volume_solids * 10.0) / float(dft) if dft > 0 else 0
    theoretical_liters = area_m2 / theoretical_coverage_m2_l if theoretical_coverage_m2_l > 0 else 0

    loss_factor = max(0, min(95, loss_pct)) / 100.0
    practical_liters = theoretical_liters / (1.0 - loss_factor) if loss_factor < 1.0 else theoretical_liters

    # Gallons (US Gallon = 3.78541 Liters)
    practical_gallons = practical_liters / 3.78541

    return {
        'surface_area_m2': round(area_m2, 2),
        'surface_area_sqft': round(area_sq_ft, 2),
        'theoretical_coverage_m2_per_liter': round(theoretical_coverage_m2_l, 2),
        'theoretical_liters': round(theoretical_liters, 2),
        'practical_liters': round(practical_liters, 2),
        'practical_gallons': round(practical_gallons, 2),
        'loss_percentage': loss_pct
    }


def calculate_tank_roof(roof_type, diameter, roof_height, volume_solids, dft, loss_pct):
    """
    Calculates storage tank roof surface area (Flat, Conical, Dome).
    """
    radius = diameter / 2.0
    if roof_type == 'conical':
        slant_height = math.sqrt(radius**2 + roof_height**2)
        area_m2 = math.pi * radius * slant_height
    elif roof_type == 'dome':
        # Spherical cap area: 2 * PI * R_sphere * h = PI * (r^2 + h^2)
        area_m2 = math.pi * (radius**2 + roof_height**2)
    else:  # flat
        area_m2 = math.pi * (radius**2)

    area_sq_ft = area_m2 * 10.7639

    theoretical_coverage = (volume_solids * 10.0) / float(dft) if dft > 0 else 0
    theoretical_liters = area_m2 / theoretical_coverage if theoretical_coverage > 0 else 0

    loss_factor = max(0, min(95, loss_pct)) / 100.0
    practical_liters = theoretical_liters / (1.0 - loss_factor) if loss_factor < 1.0 else theoretical_liters

    return {
        'roof_type': roof_type,
        'surface_area_m2': round(area_m2, 2),
        'surface_area_sqft': round(area_sq_ft, 2),
        'theoretical_liters': round(theoretical_liters, 2),
        'practical_liters': round(practical_liters, 2),
        'practical_gallons': round(practical_liters / 3.78541, 2)
    }


def calculate_pipe_spool(outer_diameter_mm, length_m, quantity, volume_solids, dft, loss_pct):
    """
    Calculates pipe spool external surface area and coating quantities.
    outer_diameter_mm: Outer pipe diameter in mm
    length_m: Length of individual pipe spool in meters
    """
    outer_diameter_m = outer_diameter_mm / 1000.0
    single_pipe_area_m2 = math.pi * outer_diameter_m * length_m
    total_area_m2 = single_pipe_area_m2 * quantity
    total_area_sqft = total_area_m2 * 10.7639

    theoretical_coverage = (volume_solids * 10.0) / float(dft) if dft > 0 else 0
    theoretical_liters = total_area_m2 / theoretical_coverage if theoretical_coverage > 0 else 0

    loss_factor = max(0, min(95, loss_pct)) / 100.0
    practical_liters = theoretical_liters / (1.0 - loss_factor) if loss_factor < 1.0 else theoretical_liters

    return {
        'outer_diameter_mm': outer_diameter_mm,
        'length_m': length_m,
        'quantity': quantity,
        'total_surface_area_m2': round(total_area_m2, 2),
        'total_surface_area_sqft': round(total_area_sqft, 2),
        'theoretical_liters': round(theoretical_liters, 2),
        'practical_liters': round(practical_liters, 2)
    }


def calculate_abrasive_blasting(surface_area_m2, abrasive_type='garnet', initial_condition='B'):
    """
    Calculates abrasive blasting media consumption and nozzle productivity.
    Abrasive consumption rates per m²:
      - Garnet: ~18 kg/m²
      - Copper Slag: ~30 kg/m²
      - Steel Grit/Shot: ~12 kg/m²
    """
    rates = {
        'garnet': 18.0,
        'copper_slag': 30.0,
        'steel_grit': 12.0,
        'aluminum_oxide': 22.0
    }

    # Condition difficulty multiplier (SSPC/ISO rust grade A=1.0, B=1.1, C=1.25, D=1.4)
    condition_multipliers = {
        'A': 1.0,
        'B': 1.1,
        'C': 1.25,
        'D': 1.4
    }

    rate_per_m2 = rates.get(abrasive_type.lower(), 20.0)
    mult = condition_multipliers.get(initial_condition.upper(), 1.1)

    total_kg = surface_area_m2 * rate_per_m2 * mult
    total_metric_tons = total_kg / 1000.0

    # Nozzle blasting speed average ~ 12 m²/hour per operator
    blasting_hours = surface_area_m2 / 12.0

    return {
        'surface_area_m2': round(surface_area_m2, 2),
        'abrasive_type': abrasive_type,
        'initial_condition': initial_condition,
        'consumption_kg': round(total_kg, 2),
        'consumption_metric_tons': round(total_metric_tons, 3),
        'estimated_nozzle_hours': round(blasting_hours, 1)
    }
