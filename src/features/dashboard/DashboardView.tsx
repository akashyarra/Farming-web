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
  CalendarDays
} from 'lucide-react';
import {
  Language,
  UserProfile,
  FarmCrop,
  WeatherData,
  MandiPrice
} from '../../types';
import { translations } from '../../lib/i18n';

interface DashboardViewProps {
  user: UserProfile;
  crops: FarmCrop[];
  weather: WeatherData;
  mandiPrices: MandiPrice[];
  language: Language;
  onOpenQuickLog: (tab?: 'expense' | 'activity') => void;
  onNavigateTab: (tab: any) => void;
  onToggleTask: (cropId: string, taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  crops,
  weather,
  mandiPrices,
  language,
  onOpenQuickLog,
  onNavigateTab,
  onToggleTask
}) => {
  const t = translations[language];

  // Primary crops prices
  const topPrices = mandiPrices.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 600 }}>
            {language === 'te' ? 'నమస్కారం!' : language === 'hi' ? 'नमस्ते!' : 'Welcome back,'}
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ecfdf5', opacity: 0.9 }}>
            📍 {user.village}, {user.district} • {user.acres} {language === 'te' ? 'ఎకరాలు' : language === 'hi' ? 'एकड़' : 'Acres'}
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('calendar')}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700
          }}
        >
          <CalendarDays size={18} />
          <span style={{ marginTop: '2px' }}>{t.navCalendar}</span>
        </button>
      </div>

      {/* 15-Second Quick Action Bar */}
      <div className="quick-action-bar">
        <button
          className="quick-action-btn expense"
          onClick={() => onOpenQuickLog('expense')}
          aria-label="Quick Log Expense"
        >
          <PlusCircle size={20} />
          <span>{t.quickLogBtn}</span>
        </button>
        <button
          className="quick-action-btn activity"
          onClick={() => onOpenQuickLog('activity')}
          aria-label="Log Field Work"
        >
          <CheckCircle2 size={20} />
          <span>{t.logActivity}</span>
        </button>
      </div>

      {/* Rain Alert Banner (Essential for Smallholders) */}
      {weather.rain_alert && (
        <div className="rain-alert-banner">
          <div className="rain-alert-icon">
            <CloudRain size={24} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="rain-alert-title">
              <AlertTriangle size={16} color="#fef08a" />
              <span>{t.rainAlert}</span>
            </div>
            <div className="rain-alert-text">{t.rainAlertSubtitle}</div>
          </div>
        </div>
      )}

      {/* Weather Snapshot Card */}
      <div className="farm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              {t.weatherToday}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {weather.temp}°C
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginLeft: '6px' }}>
                {weather.condition}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
            <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
            {weather.last_updated}
          </div>
        </div>

        {/* Weather Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={16} color="#0284c7" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.rainChance}</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{weather.rain_chance}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={16} color="#0d9488" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.humidity}</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{weather.humidity}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={16} color="#6366f1" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.wind}</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{weather.wind_speed} km/h</div>
            </div>
          </div>
        </div>

        {/* 5-day mini forecast */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
          {weather.forecast.map((fc, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>{fc.day}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#064e3b' }}>{fc.temp}°</div>
              <div style={{ fontSize: '0.68rem', color: '#0284c7' }}>{fc.rain_chance}% rain</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Mandi Prices Glimpse */}
      <div className="farm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={18} color="#047857" />
              <span>{t.mandiTitle}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              {language === 'te' ? 'నేటి మార్కెట్ రేట్లు' : language === 'hi' ? 'आज के बाजार भाव' : "Today's Mandi Rates"}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('prices')}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#047857',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span>{language === 'te' ? 'అన్నీ చూడండి' : language === 'hi' ? 'सभी देखें' : 'View all'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topPrices.map((mp) => (
            <div
              key={mp.id}
              onClick={() => onNavigateTab('prices')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                  {mp.commodity.split('/')[0]}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {mp.market_name.split('(')[0]} • {mp.distance_km} km
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
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

      {/* Tasks Due Today */}
      <div className="farm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#d97706" />
            <span>{t.tasksDue}</span>
          </div>
          <button
            onClick={() => onNavigateTab('calendar')}
            style={{
              border: 'none',
              background: 'none',
              color: '#047857',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.navCalendar} →
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
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                border: tsk.done ? '1px solid #e2e8f0' : '1px solid #fed7aa',
                background: tsk.done ? '#f8fafc' : '#fffbeb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: tsk.done ? '#94a3b8' : '#0f172a',
                    textDecoration: tsk.done ? 'line-through' : 'none'
                  }}
                >
                  {tsk.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {tsk.cropName.split('/')[0]} • Due: {tsk.due}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Phase 2 Previews (Crop Doctor & Schemes banner) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div
          onClick={() => onNavigateTab('cropdoctor')}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            borderRadius: '14px',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
            Phase 2 AI Tool
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.96rem', fontWeight: 800, marginTop: '2px' }}>
            {t.navCropDoctor}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            {language === 'te' ? 'ఆకు ఫోటోతో తెగులు పరీక్ష' : language === 'hi' ? 'पत्ती से रोग पहचान' : 'Instant leaf disease scan'}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('schemes')}
          style={{
            background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
            color: '#ffffff',
            borderRadius: '14px',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#fde68a', fontWeight: 700, textTransform: 'uppercase' }}>
            Subsidy Finder
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.96rem', fontWeight: 800, marginTop: '2px' }}>
            {t.navSchemes}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#fcd34d', marginTop: '2px' }}>
            {language === 'te' ? 'PM-కిసాన్ అర్హత తనిఖీ' : language === 'hi' ? 'PM-किसान पात्रता' : 'PM-Kisan & subsidies'}
          </div>
        </div>
      </div>
    </div>
  );
};
