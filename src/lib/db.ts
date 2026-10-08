import Dexie, { Table } from 'dexie';
import {
  UserProfile,
  FarmCrop,
  FarmActivity,
  Transaction,
  MandiPrice,
  PriceAlert,
  WeatherData,
  SchemeInfo
} from '../types';

export interface SyncQueueItem {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload: any;
  created_at: string;
}

export class FarmDatabase extends Dexie {
  profiles!: Table<UserProfile, string>;
  crops!: Table<FarmCrop, string>;
  activities!: Table<FarmActivity, string>;
  transactions!: Table<Transaction, string>;
  mandi_prices!: Table<MandiPrice, string>;
  price_alerts!: Table<PriceAlert, string>;
  weather_cache!: Table<WeatherData, string>;
  sync_queue!: Table<SyncQueueItem, string>;

  constructor() {
    super('KisanSetuFarmDB');
    this.version(1).stores({
      profiles: 'id, phone, role',
      crops: 'id, crop_name, season, status',
      activities: 'id, crop_id, type, date, synced',
      transactions: 'id, crop_id, type, category, date, synced',
      mandi_prices: 'id, market_id, commodity, modal_price',
      price_alerts: 'id, commodity, active',
      weather_cache: 'district',
      sync_queue: 'id, table, action, created_at'
    });
  }
}

export const db = new FarmDatabase();

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'uid-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

// Initial Seed Data reflecting the PDF's primary persona: Ravi, 38, Warangal
export const initialProfile: UserProfile = {
  id: 'user-ravi-01',
  phone: '9848022334',
  name: 'Ravi Kumar (రవి కుమార్)',
  language: 'en',
  state: 'Telangana',
  district: 'Warangal (వరంగల్)',
  village: 'Atmakur (ఆత్మకూరు)',
  acres: 3,
  crops: ['Paddy (BPT 5204)', 'Groundnut (K-6)'],
  soil_type: 'Red Sandy Loam (ఎర్ర నేల)',
  isLoggedIn: true,
  role: 'farmer'
};

export const initialCrops: FarmCrop[] = [
  {
    id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి / धान',
    variety: 'BPT 5204 (Samba Mahsuri)',
    season: 'Kharif',
    acres: 2,
    sowing_date: '2026-07-15',
    expected_harvest: '2026-11-20',
    stage: 'Panicle Initiation (కంకి దశ)',
    days_passed: 84,
    total_days: 125,
    status: 'active',
    current_tasks: [
      { id: 't1', title: 'Top dress Potassium Nitrate (KNO3) - 15 kg/acre', due: 'Today', done: false, urgent: true },
      { id: 't2', title: 'Inspect leaves for Brown Plant Hopper (BPH)', due: 'Tomorrow', done: false },
      { id: 't3', title: 'Drain excess water before heavy rain forecast', due: 'In 2 days', done: true }
    ]
  },
  {
    id: 'crop-groundnut-1',
    crop_name: 'Groundnut / వేరుశెనగ / मूंगफली',
    variety: 'Kadiri-6 (K-6)',
    season: 'Kharif',
    acres: 1,
    sowing_date: '2026-08-01',
    expected_harvest: '2026-11-10',
    stage: 'Pod Formation (కాయలు కట్టే దశ)',
    days_passed: 67,
    total_days: 105,
    status: 'active',
    current_tasks: [
      { id: 't4', title: 'Gypsum application (200 kg/acre) for pod filling', due: 'In 3 days', done: false },
      { id: 't5', title: 'Light sprinkler irrigation', due: 'Next week', done: true }
    ]
  }
];

export const initialActivities: FarmActivity[] = [
  {
    id: 'act-1',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'sowing',
    date: '2026-07-15',
    notes: 'Direct nursery transplantation with 25-day old seedlings. Good soil moisture.',
    cost: 4500,
    synced: true,
    created_at: '2026-07-15T09:30:00Z',
    updated_at: '2026-07-15T09:30:00Z'
  },
  {
    id: 'act-2',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'weeding',
    date: '2026-08-10',
    notes: 'Manual weeding completed by 4 workers. Cleaned irrigation furrows.',
    cost: 2800,
    synced: true,
    created_at: '2026-08-10T14:15:00Z',
    updated_at: '2026-08-10T14:15:00Z'
  },
  {
    id: 'act-3',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'spraying',
    date: '2026-09-02',
    notes: 'Neem oil spray (1500 ppm) preventive measure against leaf folder.',
    cost: 950,
    synced: true,
    created_at: '2026-09-02T11:00:00Z',
    updated_at: '2026-09-02T11:00:00Z'
  },
  {
    id: 'act-4',
    crop_id: 'crop-groundnut-1',
    crop_name: 'Groundnut / వేరుశెనగ',
    type: 'irrigation',
    date: '2026-09-25',
    notes: 'Night electric pump irrigation for 3 hours.',
    synced: true,
    created_at: '2026-09-25T20:00:00Z',
    updated_at: '2026-09-25T20:00:00Z'
  }
];

export const initialTransactions: Transaction[] = [
  // Income
  {
    id: 'tx-1',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'income',
    category: 'harvest_sale',
    amount: 52000,
    quantity: 24,
    unit: 'Quintal',
    date: '2026-03-12',
    note: 'Previous Rabi season paddy harvest sold at Warangal yard',
    synced: true,
    created_at: '2026-03-12T10:00:00Z',
    updated_at: '2026-03-12T10:00:00Z'
  },
  // Expenses
  {
    id: 'tx-2',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'expense',
    category: 'seeds',
    amount: 3200,
    quantity: 50,
    unit: 'kg',
    date: '2026-07-02',
    note: 'Certified BPT-5204 foundation seed bag from Rythu Seva Kendra',
    synced: true,
    created_at: '2026-07-02T08:30:00Z',
    updated_at: '2026-07-02T08:30:00Z'
  },
  {
    id: 'tx-3',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'expense',
    category: 'machinery',
    amount: 4800,
    quantity: 4,
    unit: 'hours',
    date: '2026-07-12',
    note: 'Tractor rotavator & puddle plowing 2 acres',
    synced: true,
    created_at: '2026-07-12T16:00:00Z',
    updated_at: '2026-07-12T16:00:00Z'
  },
  {
    id: 'tx-4',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'expense',
    category: 'fertilizer',
    amount: 4200,
    quantity: 3,
    unit: 'bags',
    date: '2026-07-28',
    note: 'DAP (Di-ammonium phosphate) & Urea basal dose',
    synced: true,
    created_at: '2026-07-28T11:00:00Z',
    updated_at: '2026-07-28T11:00:00Z'
  },
  {
    id: 'tx-5',
    crop_id: 'crop-paddy-1',
    crop_name: 'Paddy / వరి',
    type: 'expense',
    category: 'labor',
    amount: 7200,
    quantity: 12,
    unit: 'coolies',
    date: '2026-08-10',
    note: 'Transplantation and early manual weeding labor',
    synced: true,
    created_at: '2026-08-10T17:30:00Z',
    updated_at: '2026-08-10T17:30:00Z'
  },
  {
    id: 'tx-6',
    crop_id: 'crop-groundnut-1',
    crop_name: 'Groundnut / వేరుశెనగ',
    type: 'expense',
    category: 'seeds',
    amount: 4100,
    quantity: 45,
    unit: 'kg',
    date: '2026-07-29',
    note: 'Treated K-6 groundnut seed kernels',
    synced: true,
    created_at: '2026-07-29T09:00:00Z',
    updated_at: '2026-07-29T09:00:00Z'
  },
  {
    id: 'tx-7',
    crop_id: 'crop-groundnut-1',
    crop_name: 'Groundnut / వేరుశెనగ',
    type: 'expense',
    category: 'fertilizer',
    amount: 1950,
    quantity: 2,
    unit: 'bags',
    date: '2026-08-15',
    note: 'Single Super Phosphate (SSP) for root nodules',
    synced: true,
    created_at: '2026-08-15T10:45:00Z',
    updated_at: '2026-08-15T10:45:00Z'
  }
];

export const initialMandiPrices: MandiPrice[] = [
  {
    id: 'mp-1',
    market_id: 'mkt-warangal',
    market_name: 'Warangal Mandi (వరంగల్ మార్కెట్)',
    state: 'Telangana',
    district: 'Warangal',
    distance_km: 12,
    commodity: 'Paddy (వరి / धान)',
    min_price: 2280,
    max_price: 2460,
    modal_price: 2390,
    price_date: 'Today, 07 Oct 2026',
    trend: 60,
    history_7d: [
      { date: '01 Oct', price: 2310 },
      { date: '02 Oct', price: 2330 },
      { date: '03 Oct', price: 2320 },
      { date: '04 Oct', price: 2350 },
      { date: '05 Oct', price: 2360 },
      { date: '06 Oct', price: 2330 },
      { date: '07 Oct', price: 2390 }
    ]
  },
  {
    id: 'mp-2',
    market_id: 'mkt-khammam',
    market_name: 'Khammam Yard (ఖమ్మం యార్డ్)',
    state: 'Telangana',
    district: 'Khammam',
    distance_km: 48,
    commodity: 'Paddy (వరి / धान)',
    min_price: 2300,
    max_price: 2480,
    modal_price: 2420,
    price_date: 'Today, 07 Oct 2026',
    trend: 90,
    history_7d: [
      { date: '01 Oct', price: 2320 },
      { date: '02 Oct', price: 2340 },
      { date: '03 Oct', price: 2360 },
      { date: '04 Oct', price: 2380 },
      { date: '05 Oct', price: 2390 },
      { date: '06 Oct', price: 2400 },
      { date: '07 Oct', price: 2420 }
    ]
  },
  {
    id: 'mp-3',
    market_id: 'mkt-warangal-gn',
    market_name: 'Warangal Mandi (వరంగల్ మార్కెట్)',
    state: 'Telangana',
    district: 'Warangal',
    distance_km: 12,
    commodity: 'Groundnut (వేరుశెనగ / मूंगफली)',
    min_price: 6100,
    max_price: 6750,
    modal_price: 6520,
    price_date: 'Today, 07 Oct 2026',
    trend: 120,
    history_7d: [
      { date: '01 Oct', price: 6300 },
      { date: '02 Oct', price: 6350 },
      { date: '03 Oct', price: 6400 },
      { date: '04 Oct', price: 6380 },
      { date: '05 Oct', price: 6450 },
      { date: '06 Oct', price: 6480 },
      { date: '07 Oct', price: 6520 }
    ]
  },
  {
    id: 'mp-4',
    market_id: 'mkt-guntur-chilli',
    market_name: 'Guntur Yard (గుంటూరు యార్డ్)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    distance_km: 135,
    commodity: 'Chilli (మిరప / मिर्च)',
    min_price: 18200,
    max_price: 21500,
    modal_price: 19800,
    price_date: 'Today, 07 Oct 2026',
    trend: -250,
    history_7d: [
      { date: '01 Oct', price: 20200 },
      { date: '02 Oct', price: 20400 },
      { date: '03 Oct', price: 20100 },
      { date: '04 Oct', price: 20050 },
      { date: '05 Oct', price: 20000 },
      { date: '06 Oct', price: 19900 },
      { date: '07 Oct', price: 19800 }
    ]
  },
  {
    id: 'mp-5',
    market_id: 'mkt-nizamabad-cotton',
    market_name: 'Nizamabad APMC (నిజామాబాద్)',
    state: 'Telangana',
    district: 'Nizamabad',
    distance_km: 92,
    commodity: 'Cotton (పత్తి / कपास)',
    min_price: 7100,
    max_price: 7850,
    modal_price: 7600,
    price_date: 'Today, 07 Oct 2026',
    trend: 80,
    history_7d: [
      { date: '01 Oct', price: 7420 },
      { date: '02 Oct', price: 7450 },
      { date: '03 Oct', price: 7490 },
      { date: '04 Oct', price: 7520 },
      { date: '05 Oct', price: 7510 },
      { date: '06 Oct', price: 7550 },
      { date: '07 Oct', price: 7600 }
    ]
  }
];

export const initialPriceAlerts: PriceAlert[] = [
  {
    id: 'pa-1',
    commodity: 'Paddy (వరి / धान)',
    market_name: 'Warangal Mandi',
    target_price: 2450,
    direction: 'above',
    active: true,
    created_at: '2026-10-01T10:00:00Z'
  },
  {
    id: 'pa-2',
    commodity: 'Groundnut (వేరుశెనగ / मूंगफली)',
    market_name: 'Warangal Mandi',
    target_price: 6600,
    direction: 'above',
    active: true,
    created_at: '2026-10-03T11:30:00Z'
  }
];

export const initialWeatherData: WeatherData = {
  district: 'Warangal',
  temp: 29,
  temp_min: 23,
  temp_max: 31,
  condition: 'Thunderstorm expected',
  rain_chance: 85,
  humidity: 78,
  wind_speed: 16,
  rain_alert: true,
  rain_alert_msg: 'Heavy downpour expected in 24-48 hrs (45-65 mm). Avoid urea top-dressing & secure field drainage bunds.',
  farming_advisory: 'Do not spray pesticides or foliar nutrition today. Ensure standing water channels are cleared to prevent waterlogging in groundnut.',
  last_updated: '07 Oct 2026, 17:30',
  forecast: [
    { day: 'Today', temp: 29, rain_chance: 85, condition: 'Heavy Rain' },
    { day: 'Thu', temp: 27, rain_chance: 90, condition: 'Thunderstorm' },
    { day: 'Fri', temp: 28, rain_chance: 40, condition: 'Scattered Showers' },
    { day: 'Sat', temp: 31, rain_chance: 20, condition: 'Partly Cloudy' },
    { day: 'Sun', temp: 32, rain_chance: 15, condition: 'Sunny' }
  ]
};

export const initialSchemes: SchemeInfo[] = [
  {
    id: 'sch-pmkisan',
    name: 'PM-Kisan Samman Nidhi',
    provider: 'Central Government of India',
    benefit: '₹6,000 per year (₹2,000 in 3 installments)',
    deadline: 'Ongoing / Next installment Nov 2026',
    category: 'Direct Income Support',
    eligibility: 'All landholding farmer families with cultivable land up to 5 acres.',
    apply_link: 'https://pmkisan.gov.in',
    doc_required: ['Aadhaar Card', 'Land Record (Pattadar Passbook)', 'Bank Account with NPCI mapping']
  },
  {
    id: 'sch-pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    provider: 'Ministry of Agriculture',
    benefit: 'Comprehensive crop loss insurance coverage at nominal 2% premium for Kharif crops',
    deadline: 'Registration open for Rabi 2026',
    category: 'Crop Insurance',
    eligibility: 'All farmers growing notified crops in notified areas including sharecroppers.',
    apply_link: 'https://pmfby.gov.in',
    doc_required: ['Sowing Certificate', 'Land Ownership document / Lease deed', 'Bank Passbook copy']
  },
  {
    id: 'sch-rythubandhu',
    name: 'Rythu Bharosa / Investment Support',
    provider: 'State Department of Agriculture',
    benefit: '₹15,000 per acre per year for agricultural inputs',
    deadline: 'Kharif season disbursement active',
    category: 'Input Subsidy',
    eligibility: 'Registered landholders possessing digital Dharani / Pattadar title.',
    apply_link: 'https://rythubandhu.telangana.gov.in',
    doc_required: ['Pattadar Passbook', 'Aadhaar Card linked Bank Account']
  },
  {
    id: 'sch-kusum',
    name: 'PM-KUSUM Solar Agri-Pump Subsidy',
    provider: 'Ministry of New & Renewable Energy',
    benefit: '60% government subsidy on 5HP / 7.5HP solar irrigation pumps',
    deadline: 'Limited slots per district',
    category: 'Solar Equipment Subsidy',
    eligibility: 'Farmers with open well, borewell or canal water source without grid electricity connection.',
    apply_link: 'https://mnre.gov.in/solar/pm-kusum',
    doc_required: ['Water source certificate', 'Land document', 'Identity proof']
  }
];

// Initialize database if empty
export async function initDatabase() {
  const profileCount = await db.profiles.count();
  if (profileCount === 0) {
    await db.profiles.add(initialProfile);
    await db.crops.bulkAdd(initialCrops);
    await db.activities.bulkAdd(initialActivities);
    await db.transactions.bulkAdd(initialTransactions);
    await db.mandi_prices.bulkAdd(initialMandiPrices);
    await db.price_alerts.bulkAdd(initialPriceAlerts);
    await db.weather_cache.add(initialWeatherData);
  }
}
