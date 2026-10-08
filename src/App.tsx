import React, { useState, useEffect } from 'react';
import {
  db,
  initDatabase,
  initialProfile,
  initialWeatherData,
  generateUUID
} from './lib/db';
import { syncEngine } from './lib/sync';
import {
  UserProfile,
  FarmCrop,
  FarmActivity,
  Transaction,
  PriceAlert,
  WeatherData,
  SyncStatus,
  Language,
  UserRole
} from './types';
import { fetchLiveWeather } from './lib/weatherService';
import {
  IndianLocation,
  ALL_INDIA_LOCATIONS,
  detectAutoLocation
} from './lib/locationService';
import {
  fetchLiveMandiFeed,
  ExtendedMandiPrice,
  ALL_INDIA_MANDIS
} from './lib/mandiLiveService';
import { PortalHeader } from './components/PortalHeader';
import { PortalNavBar, PortalTab } from './components/PortalNavBar';
import { QuickLogModal } from './components/QuickLogModal';
import { LocationSearchModal } from './components/LocationSearchModal';
import { WidescreenDashboard } from './features/dashboard/WidescreenDashboard';
import { LiveMandiTerminal } from './features/prices/LiveMandiTerminal';
import { FarmDiaryView } from './features/diary/FarmDiaryView';
import { ProfitView } from './features/profit/ProfitView';
import { CropCalendarView } from './features/calendar/CropCalendarView';
import { CropDoctorView } from './features/cropdoctor/CropDoctorView';
import { SchemesView } from './features/schemes/SchemesView';
import { FpoAdminView } from './features/fpo/FpoAdminView';
import { SeasonReportPrintModal } from './features/profit/SeasonReportPrintModal';
import { AuthScreen } from './features/auth/AuthScreen';
import { RotateCcw } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<PortalTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');

  // Core Data State
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Real Live Data & All-India Auto-Location State
  const [weather, setWeather] = useState<WeatherData>(initialWeatherData);
  const [selectedLocation, setSelectedLocation] = useState<IndianLocation>(ALL_INDIA_LOCATIONS[0]);
  const [liveMandiPrices, setLiveMandiPrices] = useState<ExtendedMandiPrice[]>(ALL_INDIA_MANDIS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncEngine.getStatus());

  // Modals state
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [quickLogInitialTab, setQuickLogInitialTab] = useState<'expense' | 'activity'>('expense');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Undo Toast state
  const [undoToast, setUndoToast] = useState<{ id: string; type: 'activity' | 'tx'; text: string } | null>(null);

  // Fetch Real Live Weather from Open-Meteo & Live Mandi Prices for Given Location
  const loadLiveFeed = async (loc: IndianLocation) => {
    setIsRefreshing(true);
    try {
      const [liveW, liveP] = await Promise.all([
        fetchLiveWeather(loc.lat, loc.lon, `${loc.name}, ${loc.state}`),
        fetchLiveMandiFeed(loc.lat, loc.lon)
      ]);
      setWeather(liveW);
      setLiveMandiPrices(liveP);
    } catch (err) {
      console.warn('Live API note:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Automatic Location Detection Pipeline (Runs on Mount across India)
  const runAutoLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const detected = await detectAutoLocation();
      setSelectedLocation(detected);
      await loadLiveFeed(detected);
    } catch (err) {
      console.warn('Auto location detection error:', err);
      await loadLiveFeed(ALL_INDIA_LOCATIONS[0]);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Initialize DB, subscribe to sync changes, and trigger Automatic Location Detection
  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const p = await db.profiles.toCollection().first();
      if (p) {
        setUser(p);
        setCurrentRole(p.role || 'farmer');
      }
      const c = await db.crops.toArray();
      setCrops(c);
      const a = await db.activities.reverse().sortBy('date');
      setActivities(a);
      const tx = await db.transactions.reverse().sortBy('date');
      setTransactions(tx);
      const pa = await db.price_alerts.toArray();
      setPriceAlerts(pa);

      // AUTOMATIC ALL-INDIA LOCATION DETECTION
      runAutoLocation();
    }

    loadData();

    const unsubscribe = syncEngine.subscribe((st) => {
      setSyncStatus({ ...st });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleToggleOffline = () => {
    syncEngine.toggleSimulatedOffline();
  };

  const handleTriggerSync = async () => {
    await syncEngine.triggerSync();
    const a = await db.activities.reverse().sortBy('date');
    setActivities(a);
    const tx = await db.transactions.reverse().sortBy('date');
    setTransactions(tx);
  };

  const handleToggleRole = () => {
    const nextRole: UserRole = currentRole === 'farmer' ? 'fpo' : 'farmer';
    setCurrentRole(nextRole);
    if (nextRole === 'fpo') {
      setCurrentTab('fpo');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleRefreshLiveData = () => {
    loadLiveFeed(selectedLocation);
  };

  const handleSelectLocation = (loc: IndianLocation) => {
    setSelectedLocation(loc);
    loadLiveFeed(loc);
  };

  // Auth Success Callback
  const handleAuthSuccess = async (profile: UserProfile) => {
    setUser(profile);
    setCurrentRole(profile.role);
    setIsAuthOpen(false);

    await db.profiles.put(profile);

    if (profile.crops && profile.crops.length > 0) {
      const existingCrops = await db.crops.toArray();
      const existingNames = existingCrops.map(c => c.crop_name.toLowerCase());

      for (const cropName of profile.crops) {
        const isAlreadyAdded = existingNames.some(en => en.includes(cropName.toLowerCase()));
        if (!isAlreadyAdded) {
          const newCrop: FarmCrop = {
            id: 'crop-' + generateUUID(),
            crop_name: `${cropName}`,
            variety: 'Improved High Yield',
            season: 'Kharif',
            acres: Math.max(1, Math.round(profile.acres / profile.crops.length)),
            sowing_date: new Date().toISOString().split('T')[0],
            expected_harvest: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
            stage: 'Vegetative Growth (శాకీయ దశ)',
            days_passed: 25,
            total_days: 110,
            status: 'active',
            current_tasks: [
              { id: 't-new-1', title: 'Apply balanced NPK fertilizer', due: 'Tomorrow', done: false, urgent: true },
              { id: 't-new-2', title: 'First weeding and soil earthing up', due: 'This Week', done: false }
            ]
          };
          await db.crops.add(newCrop);
        }
      }

      const freshCrops = await db.crops.toArray();
      setCrops(freshCrops);
    }

    if (profile.role === 'fpo') {
      setCurrentTab('fpo');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Sign out
  const handleSignOut = () => {
    const loggedOutUser = { ...user, isLoggedIn: false };
    setUser(loggedOutUser);
    setIsAuthOpen(true);
  };

  // 15-second Save Expense
  const handleSaveExpense = async (entry: {
    id: string;
    crop_id: string;
    crop_name: string;
    type: 'expense' | 'income';
    category: any;
    amount: number;
    note: string;
    date: string;
  }) => {
    const isOnline = syncEngine.isEffectivelyOnline();
    const newTx: Transaction = {
      ...entry,
      synced: isOnline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.transactions.add(newTx);
    setTransactions(prev => [newTx, ...prev]);

    if (!isOnline) {
      await syncEngine.enqueueChange({
        table: 'transactions',
        action: 'insert',
        payload: newTx
      });
    } else {
      syncEngine.notify();
    }

    setUndoToast({
      id: newTx.id,
      type: 'tx',
      text: `${language === 'te' ? '₹' + newTx.amount + ' నమోదయింది!' : language === 'hi' ? '₹' + newTx.amount + ' दर्ज हो गया!' : '₹' + newTx.amount + ' saved to diary!'}`
    });
    setTimeout(() => setUndoToast(null), 5000);
  };

  // Save Activity
  const handleSaveActivity = async (entry: {
    id: string;
    crop_id: string;
    crop_name: string;
    type: any;
    date: string;
    notes: string;
    cost?: number;
  }) => {
    const isOnline = syncEngine.isEffectivelyOnline();
    const newAct: FarmActivity = {
      ...entry,
      synced: isOnline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.activities.add(newAct);
    setActivities(prev => [newAct, ...prev]);

    if (!isOnline) {
      await syncEngine.enqueueChange({
        table: 'activities',
        action: 'insert',
        payload: newAct
      });
    } else {
      syncEngine.notify();
    }

    setUndoToast({
      id: newAct.id,
      type: 'activity',
      text: `${entry.type} activity recorded!`
    });
    setTimeout(() => setUndoToast(null), 5000);
  };

  const handleUndo = async () => {
    if (!undoToast) return;
    if (undoToast.type === 'tx') {
      await db.transactions.delete(undoToast.id);
      setTransactions(prev => prev.filter(t => t.id !== undoToast.id));
    } else {
      await db.activities.delete(undoToast.id);
      setActivities(prev => prev.filter(a => a.id !== undoToast.id));
    }
    setUndoToast(null);
    syncEngine.notify();
  };

  const handleDeleteActivity = async (id: string) => {
    await db.activities.delete(id);
    setActivities(prev => prev.filter(a => a.id !== id));
    syncEngine.notify();
  };

  const handleDeleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    syncEngine.notify();
  };

  const handleAddAlert = async (alert: PriceAlert) => {
    await db.price_alerts.add(alert);
    setPriceAlerts(prev => [alert, ...prev]);
  };

  const handleRemoveAlert = async (id: string) => {
    await db.price_alerts.delete(id);
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleTask = (cropId: string, taskId: string) => {
    setCrops(prev =>
      prev.map(c => {
        if (c.id !== cropId) return c;
        return {
          ...c,
          current_tasks: c.current_tasks.map(tsk =>
            tsk.id === taskId ? { ...tsk, done: !tsk.done } : tsk
          )
        };
      })
    );
  };

  const handleOpenQuickLog = (tab: 'expense' | 'activity' = 'expense') => {
    setQuickLogInitialTab(tab);
    setIsQuickLogOpen(true);
  };

  // If Auth screen is requested OR user is logged out, render the Full-Screen Login & Signup view!
  if (isAuthOpen || !user.isLoggedIn) {
    return (
      <AuthScreen
        language={language}
        onLanguageChange={handleLanguageChange}
        onAuthSuccess={handleAuthSuccess}
        onClose={user.isLoggedIn ? () => setIsAuthOpen(false) : undefined}
      />
    );
  }

  return (
    <div className="portal-container">
      {/* Real-time Portal Header with Live Ticker, Weather Widget & Account Pill */}
      <PortalHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        syncStatus={syncStatus}
        onToggleOffline={handleToggleOffline}
        onTriggerSync={handleTriggerSync}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
        weather={weather}
        livePrices={liveMandiPrices}
        onRefreshLiveData={handleRefreshLiveData}
        isRefreshing={isRefreshing}
        selectedLocation={selectedLocation}
        onOpenLocationSearch={() => setIsLocationModalOpen(true)}
        onDetectGPS={runAutoLocation}
        isLoggedIn={user.isLoggedIn}
        userName={user.name}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Portal Top Navigation Bar */}
      <PortalNavBar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        language={language}
        currentRole={currentRole}
      />

      {/* Main Full-Width Content */}
      <main className="portal-main-content">
        {currentRole === 'fpo' || currentTab === 'fpo' ? (
          <FpoAdminView
            language={language}
            onSwitchToFarmer={() => {
              setCurrentRole('farmer');
              setCurrentTab('dashboard');
            }}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <WidescreenDashboard
                user={user}
                crops={crops}
                weather={weather}
                mandiPrices={liveMandiPrices}
                transactions={transactions}
                language={language}
                onOpenQuickLog={handleOpenQuickLog}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onToggleTask={handleToggleTask}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            )}

            {currentTab === 'mandi' && (
              <LiveMandiTerminal
                prices={liveMandiPrices}
                alerts={priceAlerts}
                language={language}
                onRefreshLiveData={handleRefreshLiveData}
                isRefreshing={isRefreshing}
                onAddAlert={handleAddAlert}
                onRemoveAlert={handleRemoveAlert}
              />
            )}

            {currentTab === 'diary' && (
              <FarmDiaryView
                activities={activities}
                crops={crops}
                language={language}
                onOpenQuickLog={handleOpenQuickLog}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {currentTab === 'profit' && (
              <ProfitView
                transactions={transactions}
                crops={crops}
                language={language}
                onOpenQuickLog={handleOpenQuickLog}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentTab === 'calendar' && (
              <CropCalendarView
                crops={crops}
                language={language}
                onToggleTask={handleToggleTask}
              />
            )}

            {currentTab === 'cropdoctor' && (
              <CropDoctorView language={language} />
            )}

            {currentTab === 'schemes' && (
              <SchemesView user={user} language={language} />
            )}
          </>
        )}
      </main>

      {/* Active Toast with 5s Undo */}
      {undoToast && (
        <div className="toast-msg">
          <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{undoToast.text}</span>
          <button
            onClick={handleUndo}
            style={{
              background: '#f59e0b',
              color: '#451a03',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Undo
          </button>
        </div>
      )}

      {/* Rapid 15-Second Entry Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        crops={crops}
        language={language}
        onSaveExpense={handleSaveExpense}
        onSaveActivity={handleSaveActivity}
        initialTab={quickLogInitialTab}
      />

      {/* All-India Location Explorer Modal */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onDetectGPS={runAutoLocation}
        isDetecting={isDetectingLocation}
      />

      {/* Official Season Audit Printable Report Modal */}
      <SeasonReportPrintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        user={user}
        crops={crops}
        transactions={transactions}
      />
    </div>
  );
}

export default App;
