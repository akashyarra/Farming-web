import React from 'react';
import {
  Sprout,
  Wifi,
  WifiOff,
  Globe,
  UserCheck,
  RefreshCw,
  MapPin,
  CloudSun,
  Activity,
  Compass,
  LogIn,
  LogOut,
  User,
  Search
} from 'lucide-react';
import { Language, SyncStatus, UserRole, WeatherData } from '../types';
import { translations } from '../lib/i18n';
import { IndianLocation } from '../lib/locationService';
import { ExtendedMandiPrice } from '../lib/mandiLiveService';

interface PortalHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  syncStatus: SyncStatus;
  onToggleOffline: () => void;
  onTriggerSync: () => void;
  currentRole: UserRole;
  onToggleRole: () => void;
  weather: WeatherData;
  livePrices: ExtendedMandiPrice[];
  onRefreshLiveData: () => void;
  isRefreshing: boolean;
  selectedLocation: IndianLocation;
  onOpenLocationSearch: () => void;
  onDetectGPS: () => void;
  isLoggedIn: boolean;
  userName: string;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  language,
  onLanguageChange,
  syncStatus,
  onToggleOffline,
  onTriggerSync,
  currentRole,
  onToggleRole,
  weather,
  livePrices,
  onRefreshLiveData,
  isRefreshing,
  selectedLocation,
  onOpenLocationSearch,
  onDetectGPS,
  isLoggedIn,
  userName,
  onOpenAuth,
  onSignOut
}) => {
  const t = translations[language];

  return (
    <>
      {/* 🔴 Real-Time Mandi Live Ticker Tape */}
      <div className="live-ticker-bar">
        <span className="ticker-badge">
          <Activity size={12} className="pulse-icon" /> LIVE MANDI FEED
        </span>
        <div className="ticker-content">
          {livePrices.map((p) => (
            <span key={p.id} className="ticker-item">
              <strong>{p.commodity.split('/')[0].trim()}</strong> ({p.market_name.split('(')[0].trim()}):
              <span className="qtl">₹{p.modal_price.toLocaleString('en-IN')}/qtl</span>
              <span className={p.trend >= 0 ? 'up' : 'down'}>
                {p.trend >= 0 ? `▲ +₹${p.trend}` : `▼ -₹${Math.abs(p.trend)}`}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.7rem' }}>• {p.distance_km}km away</span>
            </span>
          ))}
          {livePrices.map((p) => (
            <span key={`${p.id}-dup`} className="ticker-item">
              <strong>{p.commodity.split('/')[0].trim()}</strong> ({p.market_name.split('(')[0].trim()}):
              <span className="qtl">₹{p.modal_price.toLocaleString('en-IN')}/qtl</span>
              <span className={p.trend >= 0 ? 'up' : 'down'}>
                {p.trend >= 0 ? `▲ +₹${p.trend}` : `▼ -₹${Math.abs(p.trend)}`}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.7rem' }}>• {p.distance_km}km away</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Portal Header */}
      <header className="portal-header">
        <div className="header-inner">
          {/* Brand Logo & Tagline */}
          <div className="brand-wrapper">
            <div className="brand-logo-icon">
              <Sprout size={26} strokeWidth={2.5} />
            </div>
            <div>
              <div className="brand-title">
                {currentRole === 'farmer' ? t.appName : 'KisanSetu FPO Portal'}
                <span className="brand-badge">
                  {currentRole === 'farmer' ? 'ALL-INDIA' : 'ADMIN PORTAL'}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>
                {language === 'te'
                  ? 'భారతీయ రైతుల ప్రత్యక్ష మార్కెట్ & వాతావరణ వేదిక'
                  : language === 'hi'
                  ? 'अखिल भारतीय लाइव मंडी व मौसम पोर्टल'
                  : 'All-India Live Mandi & GPS Weather Portal'}
              </div>
            </div>
          </div>

          {/* Live Weather & Auto-Detected Location Widget */}
          <div
            className="header-weather-widget"
            style={{ cursor: 'pointer' }}
            onClick={onOpenLocationSearch}
            title="Click to search any district or APMC across India"
          >
            <CloudSun size={24} color="#fcd34d" />
            <div>
              <div className="header-weather-temp">
                <span>{weather.temp}°C</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ecfdf5', marginLeft: '4px' }}>
                  {weather.condition.split('/')[0]}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                <span>📍 <strong>{selectedLocation.name}</strong>, {selectedLocation.state}</span>
                <span style={{ color: '#38bdf8' }}>• {weather.rain_chance}% Rain</span>
              </div>
            </div>

            {/* Change Location Search Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLocationSearch();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Search all Indian locations"
            >
              <Search size={12} />
              <span>Change</span>
            </button>

            {/* GPS Auto Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDetectGPS();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Auto-detect current GPS position"
            >
              <Compass size={13} />
              <span>Auto</span>
            </button>
          </div>

          {/* Controls: Refresh Live Data, Language, Role, Offline, Auth */}
          <div className="header-controls">
            {/* Refresh Live Data Button */}
            <button
              onClick={onRefreshLiveData}
              disabled={isRefreshing}
              style={{
                minHeight: '38px',
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isRefreshing ? '#047857' : '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
              title="Fetch latest live mandi trades and weather observations"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
              <span>{isRefreshing ? 'Fetching...' : '⚡ Refresh'}</span>
            </button>

            {/* Language Selector Pill */}
            <button
              className="lang-select-pill"
              onClick={() => {
                const order: Language[] = ['en', 'te', 'hi'];
                const next = order[(order.indexOf(language) + 1) % order.length];
                onLanguageChange(next);
              }}
              title="Switch Language / భాష మార్చండి / भाषा बदलें"
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'English' : language === 'te' ? 'తెలుగు' : 'हिन्दी'}</span>
            </button>

            {/* Role Switcher */}
            <button
              className="icon-btn"
              onClick={onToggleRole}
              title={currentRole === 'farmer' ? 'Switch to FPO Coordinator Portal' : 'Switch to Farmer View'}
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <UserCheck size={18} />
            </button>

            {/* Offline Simulation Button */}
            <button
              onClick={onToggleOffline}
              className="sim-switch"
              style={{ background: syncStatus.isOnline ? '#065f46' : '#78350f' }}
              title="Toggle network simulation"
            >
              {syncStatus.isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
              <span>{syncStatus.isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Login / Signup / User Account Pill */}
            {isLoggedIn ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '10px',
                  padding: '4px 10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 800 }}>
                  <User size={14} color="#34d399" />
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userName.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    marginLeft: '4px'
                  }}
                  title="Sign Out / Switch Account"
                >
                  <LogOut size={12} />
                  <span>Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  minHeight: '38px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f59e0b',
                  color: '#451a03',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)'
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
