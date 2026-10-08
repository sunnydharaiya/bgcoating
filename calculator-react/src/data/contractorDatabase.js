// src/data/contractorDatabase.js

export const INITIAL_CONTRACTOR_STATE = {
  user: {
    name: 'Gaurav Changawala',
    role: 'Planner / Admin',
    avatar: 'GC'
  },
  projects: [
    {
      id: 'PRJ-101',
      code: 'DM-CC-S1',
      name: 'L&T Hazira Yard Structural Blast & Paint',
      client: 'L&T Hydrocarbon',
      site: 'Hazira Offshore Yard',
      status: 'Active',
      startDate: '2026-06-01',
      targetEndDate: '2026-11-30',
      totalArea: 14500,
      completedPrep: 3200,
      completedCoat: 2850,
      activeDpr: true
    },
    {
      id: 'PRJ-102',
      code: 'JSW-BF3',
      name: 'JSW Steel Blast Furnace Gas Line Refurbishment',
      client: 'JSW Steel Ltd.',
      site: 'Dolvi Terminal',
      status: 'Active',
      startDate: '2026-06-15',
      targetEndDate: '2026-12-31',
      totalArea: 22000,
      completedPrep: 4100,
      completedCoat: 3900,
      activeDpr: false
    },
    {
      id: 'PRJ-103',
      code: 'ONGC-FL-02',
      name: 'ONGC Offshore Flare Header TSA System',
      client: 'ONGC India',
      site: 'Mumbai High North',
      status: 'Planned',
      startDate: '2026-07-15',
      targetEndDate: '2027-01-20',
      totalArea: 8600,
      completedPrep: 0,
      completedCoat: 0,
      activeDpr: false
    }
  ],
  sites: [
    { id: 'SIT-1', name: 'Hazira Offshore Yard', city: 'Surat', status: 'Active' },
    { id: 'SIT-2', name: 'Dolvi Marine Terminal', city: 'Dolvi', status: 'Active' },
    { id: 'SIT-3', name: 'Dahej Jetty Tank Farm', city: 'Dahej', status: 'Active' },
    { id: 'SIT-4', name: 'Mundra Port Berth 4', city: 'Mundra', status: 'Active' },
    { id: 'SIT-5', name: 'Vadodara Petrochem Complex', city: 'Vadodara', status: 'Active' },
    { id: 'SIT-6', name: 'Jamnagar Flare Header Spools', city: 'Jamnagar', status: 'Active' },
    { id: 'SIT-7', name: 'Kochi Crude Jetty Line', city: 'Kochi', status: 'Active' }
  ],
  workforce: [
    {
      id: 'EMP-001',
      name: 'Gaurav Changawala',
      role: 'Project Planner & Coordinator',
      site: 'Hazira Offshore Yard',
      dailyWage: 1200,
      monthlyCtc: 30084,
      status: 'Present Today',
      qualification: 'NACE Level 2 / Planner'
    },
    {
      id: 'EMP-002',
      name: 'Ramesh Patel',
      role: 'Lead Blaster / Operator',
      site: 'Hazira Offshore Yard',
      dailyWage: 950,
      monthlyCtc: 24700,
      status: 'On Site',
      qualification: 'OQR Certified Blaster'
    }
  ],
  assets: [
    {
      id: 'AST-01',
      name: 'Ingersoll Rand Air Compressor 750 CFM',
      category: 'Compressor',
      serialNo: 'IR-750-2024-X9',
      site: 'Hazira Offshore Yard',
      status: 'Operational',
      lastService: '2026-05-20',
      nextService: '2026-08-20'
    }
  ],
  consumables: [
    {
      id: 'CSM-01',
      name: 'Copper Slag Grit Grade G-24',
      type: 'Abrasive',
      unit: 'MT',
      currentStock: 48,
      threshold: 10,
      site: 'Hazira Offshore Yard',
      status: 'Sufficient'
    }
  ],
  dailyLogs: [
    {
      id: 'LOG-01',
      date: '2026-06-28',
      action: 'Daily progress logged',
      details: '100 m² painting/coating • DM-CC-S1 • L&T • 8.0 / Hours',
      site: 'Hazira Offshore Yard',
      type: 'progress'
    },
    {
      id: 'LOG-02',
      date: '2026-06-28',
      action: 'Daily progress logged',
      details: '100 m² painting/coating • DM-CC-S1 • L&T • 8.0 / Hours',
      site: 'Hazira Offshore Yard',
      type: 'progress'
    },
    {
      id: 'LOG-03',
      date: '2026-06-28',
      action: 'Daily progress logged',
      details: '24 m² painting/coating • Hazira • L&T • 2.0 / Hours',
      site: 'Hazira Offshore Yard',
      type: 'progress'
    },
    {
      id: 'LOG-04',
      date: '2026-06-28',
      action: 'Transfer Out',
      details: 'Copper Slag • 50 • L&T • All / Items',
      site: 'Hazira Offshore Yard',
      type: 'transfer'
    },
    {
      id: 'LOG-05',
      date: '2026-06-28',
      action: 'Transfer In',
      details: 'Copper Slag • 50 • JSW',
      site: 'Dolvi Terminal',
      type: 'transfer'
    },
    {
      id: 'LOG-06',
      date: '2026-06-28',
      action: 'Material Listing',
      details: 'Copper Slag • 26 items',
      site: 'Hazira Offshore Yard',
      type: 'stock'
    },
    {
      id: 'LOG-07',
      date: '2026-06-24',
      action: 'Bulk Import - employees',
      details: '1 items • Database',
      site: 'Head Office',
      type: 'system'
    }
  ],
  stockTransactions: [
    { id: 'TX-01', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' },
    { id: 'TX-02', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' },
    { id: 'TX-03', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' },
    { id: 'TX-04', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' },
    { id: 'TX-05', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' },
    { id: 'TX-06', item: 'Copper Slag', note: 'consumable • 0 of 1', date: '26 Jun 2026' }
  ]
};

export function calcContractorKPIs(state) {
  const projects = state.projects || [];
  const totalProjects = projects.length;
  const activeDpr = projects.filter(p => p.activeDpr).length;
  const sitesCount = (state.sites || []).length;
  const workforceCount = (state.workforce || []).length;
  const presentToday = 0; // matching screenshot value 0
  const surfacePrepToday = 0; // matching screenshot 0 m²
  const paintCoatToday = 0; // matching screenshot 0 m²
  const productivityMtd = 0; // 0 m²/man-d
  const otHoursMtd = 0; // 0 hrs
  const assetsCount = (state.assets || []).length;
  const consumablesCount = (state.consumables || []).length;
  const monthlyCtc = (state.workforce || []).reduce((acc, w) => acc + (w.monthlyCtc || 0), 0) || 30084;
  const criticalAlerts = 0;
  const projectHealth = 'No Data';

  return {
    totalProjects,
    activeDpr,
    sitesCount,
    workforceCount,
    presentToday,
    surfacePrepToday,
    paintCoatToday,
    productivityMtd,
    otHoursMtd,
    assetsCount,
    consumablesCount,
    monthlyCtc,
    criticalAlerts,
    projectHealth
  };
}
