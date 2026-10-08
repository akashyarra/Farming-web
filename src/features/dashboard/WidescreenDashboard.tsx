import React from 'react';
import {
  CloudRain,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Droplets,
  Wind,
  PlusCircle,
  Sparkles,
  CalendarDays,
  Activity,
  Landmark,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sprout
} from 'lucide-react';
import {
  Language,
  UserProfile,
  FarmCrop,
  WeatherData,
  Transaction
} from '../../types';
import { translations } from '../../lib/i18n';
import { ExtendedMandiPrice } from '../../lib/mandiLiveService';
import { PortalTab } from '../../components/PortalNavBar';

interface WidescreenDashboardProps {
  user: UserProfile;
  crops: FarmCrop[];
  weather: WeatherData;
  mandiPrices: ExtendedMandiPrice[];
  transactions: Transaction[];
  language: Language;
  onOpenQuickLog: (tab?: 'expense' | 'activity') => void;
  onNavigateTab: (tab: PortalTab) => void;
  onToggleTask: (cropId: string, taskId: string) => void;
  onOpenReportModal: () => void;
}

export const WidescreenDashboard: React.FC<WidescreenDashboardProps> = ({
  user,
  crops,
  weather,
  mandiPrices,
  transactions,
  language,
  onOpenQuickLog,
  onNavigateTab,
  onToggleTask,
  onOpenReportModal
}) => {
  const t = translations[language];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const topPrices = mandiPrices.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Quick Actions */}
      <div
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'te' ? 'రైతు పోర్టల్' : language === 'hi' ? 'किसान पोर्टल' : 'Active Farmer Portal'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, margin: '2px 0' }}>
            {user.name}
          </h1>
          <div style={{ fontSize: '0.82rem', color: '#ecfdf5', opacity: 0.9 }}>
            📍 {user.village}, {user.district} ({user.state}) • {user.acres} {language === 'te' ? 'ఎకరాలు' : language === 'hi' ? 'एकड़' : 'Acres'} • {user.soil_type}
          </div>
        </div>

        {/* 15-Second Rapid Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onOpenQuickLog('expense')}
            style={{
              minHeight: '48px',
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.94rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            <PlusCircle size={18} />
            <span>{t.quickLogBtn}</span>
          </button>
          <button
            onClick={() => onOpenQuickLog('activity')}
            style={{
              minHeight: '48px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.94rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{t.logActivity}</span>
          </button>
        </div>
      </div>

      {/* Rain Alert Banner (if rain probability > 50% or rain alert flag) */}
      {weather.rain_alert && (
        <div className="rain-alert-banner">
          <div className="rain-alert-icon">
            <CloudRain size={26} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="rain-alert-title">
              <AlertTriangle size={18} color="#fef08a" />
              <span>{t.rainAlert} — {weather.district}</span>
            </div>
            <div className="rain-alert-text">
              {weather.rain_alert_msg}
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Widescreen Dashboard Grid */}
      <div className="dashboard-grid">
        {/* COLUMN 1: Real Live Weather & Farm Soil Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Live Open-Meteo Weather Card */}
          <div className="farm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🔴 Live Weather Radar
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                  {weather.temp}°C
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748b' }}>
                  {weather.condition}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 700 }}>
                  📍 {weather.district}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {weather.last_updated}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.rainChance}</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0284c7' }}>{weather.rain_chance}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.humidity}</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0d9488' }}>{weather.humidity}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.wind}</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#6366f1' }}>{weather.wind_speed} km/h</div>
              </div>
            </div>

            {/* Advisory note */}
            <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: '10px', marginTop: '12px', fontSize: '0.76rem', color: '#065f46', lineHeight: 1.4 }}>
              <strong>Advisory:</strong> {weather.farming_advisory}
            </div>

            {/* 5-Day Forecast */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              {weather.forecast.map((fc, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>{fc.day}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#064e3b' }}>{fc.temp}°</div>
                  <div style={{ fontSize: '0.68rem', color: '#0284c7' }}>{fc.rain_chance}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Cultivated Crops Card */}
          <div className="farm-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sprout size={18} color="#047857" />
              <span>Active Farm Inventory</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {crops.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigateTab('calendar')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#064e3b' }}>
                      {c.crop_name.split('/')[0]} ({c.variety})
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>
                      {c.acres} Acres
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    Stage: {c.stage} • Day {c.days_passed}/{c.total_days}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Live Mandi Terminal Snapshot & Due Agricultural Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Live Mandi Market Depth Card */}
          <div className="farm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 800, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} color="#047857" />
                  <span>{t.mandiTitle}</span>
                </h2>
                <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Real-time APMC trading prices with daily arrivals
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('mandi')}
                style={{
                  border: 'none',
                  background: '#ecfdf5',
                  color: '#047857',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Full Terminal</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topPrices.map((mp) => (
                <div
                  key={mp.id}
                  onClick={() => onNavigateTab('mandi')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                      {mp.commodity.split('/')[0]}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {mp.market_name.split('(')[0]} • {mp.distance_km} km away • Arrivals: {mp.arrivals_tonnes}T
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
                      ₹{mp.modal_price.toLocaleString('en-IN')}
                    </div>
                    <span className={`price-delta ${mp.trend >= 0 ? 'up' : 'down'}`}>
                      {mp.trend >= 0 ? `+₹${mp.trend}` : `-₹${Math.abs(mp.trend)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks Due */}
          <div className="farm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} color="#d97706" />
                <span>{t.tasksDue}</span>
              </h3>
              <button
                onClick={() => onNavigateTab('calendar')}
                style={{ background: 'none', border: 'none', color: '#047857', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Calendar →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {crops.flatMap(c => c.current_tasks.map(tsk => ({ ...tsk, cropId: c.id, cropName: c.crop_name }))).map((tsk) => (
                <div
                  key={tsk.id}
                  onClick={() => onToggleTask(tsk.cropId, tsk.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: tsk.done ? '1px solid #e2e8f0' : '1px solid #fed7aa',
                    background: tsk.done ? '#f8fafc' : '#fffbeb',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: tsk.done ? '2px solid #047857' : '2px solid #d97706',
                      background: tsk.done ? '#047857' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    {tsk.done && <CheckCircle2 size={16} strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: tsk.done ? '#94a3b8' : '#0f172a', textDecoration: tsk.done ? 'line-through' : 'none' }}>
                      {tsk.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {tsk.cropName.split('/')[0]} • Due: {tsk.due}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Season Financial Overview & Agritech Services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Net Profit Big Banner Card */}
          <div
            className="farm-card elevated"
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
                  {t.netProfit} (Kharif 2026)
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800 }}>
                  ₹{netProfit.toLocaleString('en-IN')}
                </div>
              </div>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '99px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowUpRight size={16} /> 62% Margin
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#d1fae5' }}>Total Revenue</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹{totalIncome.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#fed7aa' }}>Total Expenses</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹{totalExpense.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <button
              onClick={onOpenReportModal}
              style={{
                width: '100%',
                marginTop: '14px',
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: '#ffffff',
                color: '#064e3b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <FileText size={15} />
              <span>{t.exportPdfReport}</span>
            </button>
          </div>

          {/* Quick AI Crop Doctor Card */}
          <div
            className="farm-card"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              border: '1px solid #334155',
              cursor: 'pointer'
            }}
            onClick={() => onNavigateTab('cropdoctor')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  ON-DEVICE AI SCANNER
                </span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '2px 0' }}>
                  {t.cropDoctorTitle}
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Instant leaf disease diagnosis with organic remedies
                </p>
              </div>
              <Activity size={28} color="#38bdf8" />
            </div>
          </div>

          {/* Government Scheme Match */}
          <div
            className="farm-card"
            style={{
              background: '#fffbeb',
              borderColor: '#fde68a',
              cursor: 'pointer'
            }}
            onClick={() => onNavigateTab('schemes')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                  Verified Subsidy
                </span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#78350f', margin: '2px 0' }}>
                  PM-Kisan & State Subsidies
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#92400e' }}>
                  Eligible for ₹6,000/yr + Rythu assistance
                </p>
              </div>
              <Landmark size={26} color="#d97706" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
