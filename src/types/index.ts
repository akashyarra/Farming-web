export type Language = 'en' | 'te' | 'hi';

export type UserRole = 'farmer' | 'fpo';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  language: Language;
  state: string;
  district: string;
  village: string;
  acres: number;
  crops: string[];
  soil_type: string;
  isLoggedIn: boolean;
  role: UserRole;
}

export interface FarmCrop {
  id: string;
  crop_name: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  acres: number;
  sowing_date: string;
  expected_harvest: string;
  stage: string;
  days_passed: number;
  total_days: number;
  status: 'active' | 'harvested';
  current_tasks: { id: string; title: string; due: string; done: boolean; urgent?: boolean }[];
}

export type ActivityType = 'sowing' | 'irrigation' | 'spraying' | 'fertilizer' | 'weeding' | 'harvest' | 'other';

export interface FarmActivity {
  id: string;
  crop_id: string;
  crop_name: string;
  type: ActivityType;
  date: string;
  notes: string;
  cost?: number;
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'expense' | 'income';
export type TransactionCategory =
  | 'seeds'
  | 'fertilizer'
  | 'labor'
  | 'machinery'
  | 'pesticides'
  | 'transport'
  | 'harvest_sale'
  | 'other';

export interface Transaction {
  id: string;
  crop_id: string;
  crop_name: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  quantity?: number;
  unit?: string;
  date: string;
  note: string;
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export interface MandiPrice {
  id: string;
  market_id: string;
  market_name: string;
  state: string;
  district: string;
  distance_km: number;
  commodity: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
  trend: number; // e.g. +120 or -50
  history_7d: { date: string; price: number }[];
}

export interface PriceAlert {
  id: string;
  commodity: string;
  market_name: string;
  target_price: number;
  direction: 'above' | 'below';
  active: boolean;
  created_at: string;
}

export interface WeatherData {
  district: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  condition: string;
  rain_chance: number;
  humidity: number;
  wind_speed: number;
  rain_alert: boolean;
  rain_alert_msg: string;
  farming_advisory: string;
  last_updated: string;
  forecast: { day: string; temp: number; rain_chance: number; condition: string }[];
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string;
}

export interface SchemeInfo {
  id: string;
  name: string;
  provider: string;
  benefit: string;
  deadline: string;
  category: string;
  eligibility: string;
  apply_link: string;
  doc_required: string[];
}
