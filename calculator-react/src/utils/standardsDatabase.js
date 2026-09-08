// Standards and Material Database extracted from BG CoatingOS™ reference system

export const ABRASIVE_DB = {
  'Steel Grit': {
    recy: '150–200+ recycles (closed system)',
    hard: '55–65 HRC',
    den: '7.4 g/cm³',
    grades: {
      'G10': { size: '2.0–2.8 mm', p: [100, 150], pr: [6.0, 7.5], cons: [1.5, 3.0], sa: 'Sa 2½ / Sa 3', coat: 'Heavy build linings · specialized systems' },
      'G12': { size: '1.7–2.4 mm', p: [85, 125], pr: [6.0, 7.5], cons: [1.2, 2.5], sa: 'Sa 2½ / Sa 3', coat: 'Glass flake · Novolac · TSA' },
      'G14': { size: '1.4–2.0 mm', p: [75, 100], pr: [5.5, 7.5], cons: [1.0, 2.2], sa: 'Sa 2½ / Sa 3', coat: 'Glass flake epoxy · Novolac epoxy · TSA sealer' },
      'G16': { size: '1.2–1.7 mm', p: [70, 90], pr: [5.5, 7.5], cons: [0.9, 2.0], sa: 'Sa 2½ / Sa 3', coat: 'High build epoxy · Zinc rich epoxy' },
      'G18': { size: '1.0–1.4 mm', p: [60, 80], pr: [5.5, 7.0], cons: [0.8, 1.8], sa: 'Sa 2½', coat: 'High build epoxy · Zinc rich epoxy' },
      'G25': { size: '0.7–1.2 mm', p: [50, 70], pr: [5.5, 7.0], cons: [0.7, 1.5], sa: 'Sa 2½', coat: 'Epoxy primer · Epoxy MIO · PU' },
      'G40': { size: '0.4–0.7 mm', p: [40, 60], pr: [5.0, 7.0], cons: [0.6, 1.2], sa: 'Sa 2½', coat: 'Epoxy primer · Epoxy MIO · PU' },
      'G50': { size: '0.3–0.4 mm', p: [30, 50], pr: [5.0, 6.5], cons: [0.5, 1.0], sa: 'Sa 2 / Sa 2½', coat: 'Zinc phosphate primer · Epoxy primer' },
      'G80': { size: '0.2–0.3 mm', p: [20, 40], pr: [4.5, 6.5], cons: [0.4, 0.8], sa: 'Sa 2 / Sa 2½', coat: 'Thin film primers · Alkyd · Acrylic' }
    }
  },
  'Steel Shot': {
    recy: '200–300+ recycles (closed system)',
    hard: '40–50 HRC',
    den: '7.4 g/cm³',
    grades: {
      'S110': { size: '0.3 mm', p: [15, 25], pr: [4.5, 6.0], cons: [0.3, 0.6], sa: 'Sa 2', coat: 'Shop primers · thin film systems' },
      'S170': { size: '0.4–0.5 mm', p: [20, 35], pr: [4.5, 6.5], cons: [0.4, 0.8], sa: 'Sa 2 / Sa 2½', coat: 'Zinc phosphate primer · Alkyd' },
      'S230': { size: '0.6 mm', p: [25, 40], pr: [5.0, 6.5], cons: [0.5, 0.9], sa: 'Sa 2 / Sa 2½', coat: 'Zinc phosphate · Alkyd · Acrylic' },
      'S280': { size: '0.7 mm', p: [30, 45], pr: [5.0, 7.0], cons: [0.5, 1.0], sa: 'Sa 2½', coat: 'Epoxy primer systems' },
      'S330': { size: '0.8 mm', p: [30, 50], pr: [5.0, 7.0], cons: [0.6, 1.1], sa: 'Sa 2½', coat: 'Epoxy primer · Epoxy MIO · PU' },
      'S390': { size: '1.0 mm', p: [40, 60], pr: [5.5, 7.0], cons: [0.7, 1.3], sa: 'Sa 2½', coat: 'Epoxy primer · Epoxy MIO · PU' },
      'S460': { size: '1.2 mm', p: [45, 65], pr: [5.5, 7.5], cons: [0.8, 1.5], sa: 'Sa 2½', coat: 'High build epoxy systems' },
      'S550': { size: '1.4 mm', p: [50, 70], pr: [5.5, 7.5], cons: [0.9, 1.7], sa: 'Sa 2½', coat: 'High build epoxy · Zinc rich epoxy' },
      'S660': { size: '1.7 mm', p: [60, 85], pr: [6.0, 7.5], cons: [1.0, 2.0], sa: 'Sa 2½ / Sa 3', coat: 'High build epoxy · Glass flake' }
    }
  },
  'Garnet': {
    recy: '3–5 recycles',
    hard: '7.5–8 Mohs',
    den: '4.1 g/cm³',
    grades: {
      '16/30': { size: '0.6–1.2 mm', p: [75, 110], pr: [5.5, 7.5], cons: [10, 18], sa: 'Sa 2½ / Sa 3', coat: 'Glass flake · Novolac · TSA sealer' },
      '20/40': { size: '0.4–0.85 mm', p: [60, 90], pr: [5.5, 7.5], cons: [8, 15], sa: 'Sa 2½ / Sa 3', coat: 'High build epoxy · Glass flake' },
      '30/60': { size: '0.25–0.6 mm', p: [45, 75], pr: [5.0, 7.0], cons: [7, 12], sa: 'Sa 2½', coat: 'Epoxy primer · Epoxy MIO · PU' },
      '30/80': { size: '0.18–0.6 mm', p: [40, 65], pr: [5.0, 7.0], cons: [6, 10], sa: 'Sa 2½', coat: 'Epoxy primer · PU systems' },
      '80 Mesh': { size: '0.18 mm avg', p: [25, 40], pr: [4.5, 6.5], cons: [5, 8], sa: 'Sa 2 / Sa 2½', coat: 'Zinc phosphate · thin primers · sweep blast' }
    }
  },
  'Copper Slag': {
    recy: 'Expendable (1–2 uses)',
    hard: '6–7 Mohs',
    den: '3.3 g/cm³',
    grades: {
      'Fine': { size: '0.2–0.5 mm', p: [40, 65], pr: [5.0, 7.0], cons: [15, 25], sa: 'Sa 2 / Sa 2½', coat: 'Epoxy primer · PU systems' },
      'Medium': { size: '0.5–1.5 mm', p: [50, 100], pr: [5.5, 7.5], cons: [20, 35], sa: 'Sa 2½', coat: 'High build epoxy · Epoxy MIO' },
      'Coarse': { size: '1.5–3.0 mm', p: [75, 125], pr: [6.0, 7.5], cons: [25, 45], sa: 'Sa 2½ / Sa 3', coat: 'Glass flake · heavy build linings' }
    }
  }
};

export const RECYCLE_DB = {
  'Steel Grit': { life: '150–200+', rec: 95, brk: 1.0, cons: '0.5–2', den: '~4.3 (bulk)', hard: '55–65 HRC', rating: '★★★★★ Excellent' },
  'Steel Shot': { life: '200–300+', rec: 96, brk: 0.7, cons: '0.3–1.5', den: '~4.5 (bulk)', hard: '40–50 HRC', rating: '★★★★★ Excellent' },
  'Garnet': { life: '3–5', rec: 80, brk: 15, cons: '6–15', den: '~2.3 (bulk)', hard: '7.5–8 Mohs', rating: '★★★ Good' },
  'Copper Slag': { life: '1–2', rec: 60, brk: 35, cons: '15–35', den: '~1.8 (bulk)', hard: '6–7 Mohs', rating: '★ Expendable' },
  'Aluminium Oxide': { life: '6–12', rec: 85, brk: 10, cons: '3–8', den: '~1.8 (bulk)', hard: '9 Mohs', rating: '★★★★ Very Good' },
  'Glass Beads': { life: '8–15', rec: 88, brk: 8, cons: '2–6', den: '~1.5 (bulk)', hard: '5.5–6 Mohs', rating: '★★★★ Very Good' },
};

export const NOZZLE_AIR_DB = {
  '6': { name: '6 mm (No.4)', cfm: [180, 220], pr: [6, 7.5] },
  '8': { name: '8 mm (No.5)', cfm: [300, 400], pr: [6, 7.5] },
  '9.5': { name: '9.5 mm (No.6)', cfm: [450, 550], pr: [6, 7.5] },
  '11': { name: '11 mm (No.7)', cfm: [600, 750], pr: [6, 7.5] },
  '12.5': { name: '12.5 mm (No.8)', cfm: [700, 900], pr: [6, 7.5] }
};

export const DC_DB = [
  { model: 'BG-DC-3000', cap: 3000, hp: 5, kw: 3.7, fa: 80, room: 'up to 5 × 3 × 3 m' },
  { model: 'BG-DC-6000', cap: 6000, hp: 10, kw: 7.5, fa: 160, room: 'up to 8 × 4 × 4 m' },
  { model: 'BG-DC-9000', cap: 9000, hp: 15, kw: 11, fa: 240, room: 'up to 10 × 5 × 4 m' },
  { model: 'BG-DC-12000', cap: 12000, hp: 20, kw: 15, fa: 320, room: 'up to 12 × 6 × 5 m' },
  { model: 'BG-DC-18000', cap: 18000, hp: 30, kw: 22, fa: 480, room: 'up to 15 × 8 × 5 m' },
  { model: 'BG-DC-24000', cap: 24000, hp: 40, kw: 30, fa: 640, room: 'up to 18 × 8 × 6 m' },
  { model: 'BG-DC-30000', cap: 30000, hp: 50, kw: 37, fa: 800, room: 'up to 20 × 10 × 6 m' },
  { model: 'BG-DC-40000', cap: 40000, hp: 60, kw: 45, fa: 1060, room: 'up to 24 × 12 × 7 m' },
  { model: 'BG-DC-50000', cap: 50000, hp: 75, kw: 55, fa: 1330, room: 'up to 30 × 12 × 8 m' }
];

export const SAW_SECTIONS_DB = {
  SHS: {
    '25 × 25 × 2.5': [0.091, 1.64], '40 × 40 × 3.0': [0.150, 3.30], '50 × 50 × 3.0': [0.190, 4.26],
    '50 × 50 × 5.0': [0.179, 6.41], '75 × 75 × 4.0': [0.283, 8.47], '75 × 75 × 5.0': [0.279, 10.31],
    '100 × 100 × 4.0': [0.383, 11.63], '100 × 100 × 6.0': [0.374, 16.67], '150 × 150 × 6.0': [0.574, 26.20],
    '200 × 200 × 6.0': [0.774, 35.60], '250 × 250 × 6.0': [0.974, 45.00], '300 × 300 × 10.0': [1.170, 90.70]
  },
  RHS: {
    '50 × 25 × 2.0': [0.143, 2.15], '75 × 50 × 3.0': [0.240, 5.41], '100 × 50 × 4.0': [0.283, 8.47],
    '125 × 75 × 5.0': [0.379, 14.29], '150 × 100 × 5.0': [0.479, 18.20], '200 × 100 × 5.0': [0.579, 22.10],
    '250 × 150 × 6.0': [0.774, 35.60], '300 × 200 × 8.0': [0.979, 60.50], '400 × 200 × 10.0': [1.170, 90.70]
  },
  UB: {
    '150UB14': [0.576, 14.0], '180UB18': [0.685, 18.1], '200UB22': [0.911, 22.3],
    '250UB31': [1.060, 31.4], '310UB40': [1.240, 40.4], '360UB51': [1.360, 50.7],
    '410UB60': [1.490, 59.7], '460UB74': [1.640, 74.6], '530UB82': [1.850, 82.0], '610UB101': [2.070, 101.0]
  },
  UC: {
    '100UC15': [0.563, 14.8], '150UC23': [0.889, 23.4], '200UC46': [1.190, 46.2],
    '250UC73': [1.480, 72.9], '310UC97': [1.790, 96.8], '310UC137': [1.820, 137.0]
  },
  EA: {
    '50 × 50 × 5': [0.193, 3.77], '65 × 65 × 6': [0.255, 5.87], '75 × 75 × 6': [0.292, 6.81],
    '90 × 90 × 6': [0.352, 8.22], '100 × 100 × 8': [0.392, 12.20], '150 × 150 × 10': [0.590, 21.90]
  },
  PFC: {
    '75 PFC': [0.290, 5.92], '100 PFC': [0.374, 8.33], '150 PFC': [0.569, 17.70],
    '200 PFC': [0.668, 22.90], '250 PFC': [0.822, 35.50], '300 PFC': [0.920, 40.10]
  }
};
