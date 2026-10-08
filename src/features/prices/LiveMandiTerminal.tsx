import React, { useState } from 'react';
import {
  TrendingUp,
  Bell,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  X,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, PriceAlert } from '../../types';
import { translations } from '../../lib/i18n';
import { ExtendedMandiPrice } from '../../lib/mandiLiveService';
import { generateUUID } from '../../lib/db';

interface LiveMandiTerminalProps {
  prices: ExtendedMandiPrice[];
  alerts: PriceAlert[];
  language: Language;
  onRefreshLiveData: () => void;
  isRefreshing: boolean;
  onAddAlert: (alert: PriceAlert) => Promise<void>;
  onRemoveAlert: (alertId: string) => Promise<void>;
}

export const LiveMandiTerminal: React.FC<LiveMandiTerminalProps> = ({
  prices,
  alerts,
  language,
  onRefreshLiveData,
  isRefreshing,
  onAddAlert,
  onRemoveAlert
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [activeMarket, setActiveMarket] = useState<ExtendedMandiPrice>(prices[0] || ({} as ExtendedMandiPrice));
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('2450');
  const [alertSuccess, setAlertSuccess] = useState<string>('');

  const commodities = ['all', 'Paddy', 'Groundnut', 'Chilli', 'Cotton', 'Onion', 'Tomato', 'Soybean'];
  const states = ['all', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Madhya Pradesh'];

  const filtered = prices.filter((p) => {
    const matchSearch =
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.market_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCommodity =
      selectedCommodity === 'all' || p.commodity.toLowerCase().includes(selectedCommodity.toLowerCase());

    const matchState =
      selectedState === 'all' || p.state.toLowerCase() === selectedState.toLowerCase();

    return matchSearch && matchCommodity && matchState;
  });

  const handleCreateAlert = async () => {
    const target = parseInt(alertTargetPrice, 10);
    if (!target) return;

    const alert: PriceAlert = {
      id: generateUUID(),
      commodity: activeMarket?.commodity || 'Paddy',
      market_name: activeMarket?.market_name || 'Warangal Mandi',
      target_price: target,
      direction: 'above',
      active: true,
      created_at: new Date().toISOString()
    };

    await onAddAlert(alert);
    setIsAlertModalOpen(false);
    setAlertSuccess(t.alertSetSuccess);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setAlertSuccess(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Terminal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#064e3b' }}>
              Live Mandi Trading Terminal
            </h1>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '4px' }}>
              🔴 LIVE APMC
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Direct agricultural prices, daily arrival volumes (Tonnes), and 7-day modal trends
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onRefreshLiveData}
            disabled={isRefreshing}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: '#047857',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
            <span>{isRefreshing ? 'Refreshing Rates...' : 'Fetch Live Quotes'}</span>
          </button>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bell size={15} />
            <span>{t.setAlert}</span>
          </button>
        </div>
      </div>

      {alertSuccess && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '12px', color: '#065f46', fontSize: '0.84rem', fontWeight: 700 }}>
          {alertSuccess}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              placeholder="Search commodity or market yard (e.g. Warangal, Guntur, Paddy, Chilli)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Commodity Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {commodities.map((c) => (
            <button
              key={c}
              type="button"
              className={`preset-chip ${selectedCommodity === c ? 'active' : ''}`}
              onClick={() => setSelectedCommodity(c)}
            >
              {c === 'all' ? t.filterAll : c}
            </button>
          ))}
        </div>
      </div>

      {/* Active Market 7-Day Trend Hero Chart */}
      {activeMarket && activeMarket.history_7d && (
        <div className="farm-card elevated" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                LIVE 7-DAY PRICE RUNNER
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {activeMarket.commodity.split('/')[0]} @ {activeMarket.market_name}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Grade: {activeMarket.grade} • Daily Arrivals: <strong>{activeMarket.arrivals_tonnes} Metric Tonnes</strong> • Demand: <strong style={{ color: '#047857' }}>{activeMarket.demand_level}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#064e3b' }}>
                ₹{activeMarket.modal_price.toLocaleString('en-IN')}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>/quintal</span>
              </div>
              <span className={`price-delta ${activeMarket.trend >= 0 ? 'up' : 'down'}`}>
                {activeMarket.trend >= 0 ? `+₹${activeMarket.trend}` : `-₹${Math.abs(activeMarket.trend)}`}
              </span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div style={{ width: '100%', height: '160px', marginTop: '12px' }}>
            <svg viewBox="0 0 600 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="liveTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="20" x2="600" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="65" x2="600" y2="65" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#e2e8f0" strokeDasharray="3,3" />

              {(() => {
                const history = activeMarket.history_7d;
                if (!history || history.length < 2) return null;
                const minVal = Math.min(...history.map(h => h.price)) * 0.98;
                const maxVal = Math.max(...history.map(h => h.price)) * 1.02;
                const range = maxVal - minVal || 1;

                const pts = history.map((h, i) => {
                  const x = (i / (history.length - 1)) * 580 + 10;
                  const y = 115 - ((h.price - minVal) / range) * 90;
                  return { x, y, price: h.price, date: h.date };
                });

                const polyPoints = pts.map(p => `${p.x},${p.y}`).join(' ');
                const fillPoints = `${pts[0].x},125 ${polyPoints} ${pts[pts.length - 1].x},125`;

                return (
                  <>
                    <polygon points={fillPoints} fill="url(#liveTrendGrad)" />
                    <polyline
                      points={polyPoints}
                      fill="none"
                      stroke="#047857"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pts.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="#047857" strokeWidth="3" />
                        <text x={p.x} y={p.y - 9} fontSize="10" fontWeight="800" fill="#0f172a" textAnchor="middle">
                          ₹{p.price}
                        </text>
                        <text x={p.x} y="128" fontSize="9" fill="#64748b" textAnchor="middle">
                          {p.date}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* Grid of Mandi Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map((item) => {
          const isSelected = activeMarket?.id === item.id;
          return (
            <div
              key={item.id}
              className={`mandi-item ${isSelected ? 'elevated' : ''}`}
              onClick={() => setActiveMarket(item)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? '#047857' : '#e2e8f0',
                background: isSelected ? '#f0fdf4' : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {item.commodity}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={13} color="#047857" />
                    <span>{item.market_name}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {item.state} • {item.distance_km} km away
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="price-stat-pill">
                    ₹{item.modal_price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>/quintal</div>
                </div>
              </div>

              {/* Market Metrics Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', fontSize: '0.74rem' }}>
                <div>
                  Min-Max: <strong style={{ color: '#0f172a' }}>₹{item.min_price} - ₹{item.max_price}</strong>
                </div>
                <div>
                  Arrivals: <strong style={{ color: '#047857' }}>{item.arrivals_tonnes} Tonnes</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {item.price_date}
                </span>

                <span className={`price-delta ${item.trend >= 0 ? 'up' : 'down'}`}>
                  {item.trend >= 0 ? (
                    <>
                      <ArrowUpRight size={13} /> +₹{item.trend}
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={13} /> -₹{Math.abs(item.trend)}
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Alert Modal */}
      {isAlertModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAlertModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
                Set Live Mandi Price Alert
              </h2>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Receive instant alerts whenever <strong>{activeMarket?.commodity}</strong> reaches or exceeds your target modal rate in nearby market yards.
            </p>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Target Price (₹ per Quintal)
              </label>
              <input
                type="number"
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #047857',
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: '#064e3b'
                }}
              />
            </div>

            <button
              onClick={handleCreateAlert}
              style={{
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.98rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Check size={18} />
              <span>Activate Live Alert</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
