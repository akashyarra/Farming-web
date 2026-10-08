import React from 'react';
import {
  Sprout,
  Wifi,
  WifiOff,
  Globe,
  Smartphone,
  Monitor,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { Language, SyncStatus, UserRole } from '../types';
import { translations } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  syncStatus: SyncStatus;
  onToggleOffline: () => void;
  onTriggerSync: () => void;
  isFullMode: boolean;
  onToggleFullMode: () => void;
  currentRole: UserRole;
  onToggleRole: () => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  syncStatus,
  onToggleOffline,
  onTriggerSync,
  isFullMode,
  onToggleFullMode,
  currentRole,
  onToggleRole
}) => {
  const t = translations[language];

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <Sprout size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-title">
              {currentRole === 'farmer' ? t.appName : 'KisanSetu FPO'}
              <span className="brand-badge">
                {currentRole === 'farmer' ? 'PWA' : 'ADMIN'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
              {language === 'te' ? 'రైతుల కోసం డిజిటల్ తోడ్పాటు' : language === 'hi' ? 'किसानों का डिजिटल साथी' : 'Farmer-First Platform'}
            </div>
          </div>
        </div>

        <div className="header-controls">
          {/* Language Selector */}
          <button
            className="lang-select-pill"
            onClick={() => {
              const order: Language[] = ['en', 'te', 'hi'];
              const next = order[(order.indexOf(language) + 1) % order.length];
              onLanguageChange(next);
            }}
            title="Switch Language / భాష మార్చండి / भाषा बदलें"
            aria-label="Change Language"
          >
            <Globe size={14} />
            <span>{language === 'en' ? 'EN' : language === 'te' ? 'తెలుగు' : 'हिन्दी'}</span>
          </button>

          {/* Role Switcher (Farmer Ravi vs FPO Coordinator) */}
          <button
            className="icon-btn"
            onClick={onToggleRole}
            title={currentRole === 'farmer' ? 'Switch to FPO Admin View' : 'Switch to Farmer View'}
            aria-label="Toggle Farmer/FPO Role"
          >
            <UserCheck size={18} />
          </button>

          {/* Phone Frame Toggle */}
          <button
            className="icon-btn mode-toggle-btn"
            onClick={onToggleFullMode}
            title={isFullMode ? 'Phone Frame View' : 'Wide Desktop View'}
            aria-label="Toggle Phone Frame"
          >
            {isFullMode ? <Smartphone size={18} /> : <Monitor size={18} />}
          </button>
        </div>
      </div>

      {/* Sync Status & Offline Simulation Strip */}
      <div className="sync-strip" style={{ marginTop: '8px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {syncStatus.isSyncing ? (
            <span className="sync-badge syncing">
              <RefreshCw size={12} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              {t.statusSyncing}
            </span>
          ) : syncStatus.isOnline ? (
            <span className="sync-badge saved">
              <Wifi size={12} />
              {syncStatus.pendingCount > 0
                ? `${syncStatus.pendingCount} ${t.unsyncedEntries}`
                : t.statusAllSaved}
            </span>
          ) : (
            <span className="sync-badge offline">
              <WifiOff size={12} />
              {t.statusOffline} ({syncStatus.pendingCount} {t.unsyncedEntries})
            </span>
          )}

          <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
            {syncStatus.lastSyncedAt ? `${t.lastUpdated}` : ''}
          </span>
        </div>

        {/* Interactive Simulation Switch for Offline/Online Testing */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {syncStatus.pendingCount > 0 && syncStatus.isOnline && (
            <button
              onClick={onTriggerSync}
              className="sim-switch"
              style={{ background: '#059669', borderColor: '#34d399' }}
            >
              <RefreshCw size={11} /> {t.syncNow}
            </button>
          )}

          <button
            onClick={onToggleOffline}
            className="sim-switch"
            title="Simulate losing internet connection to test offline Dexie cache & background sync"
          >
            {syncStatus.isOnline ? 'Simulate Offline' : 'Reconnect Online'}
          </button>
        </div>
      </div>
    </header>
  );
};
