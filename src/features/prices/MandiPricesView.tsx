import React, { useState } from 'react';
import {
  TrendingUp,
  Bell,
  BellRing,
  Filter,
  MapPin,
  Calendar,
  X,
  Check,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, MandiPrice, PriceAlert } from '../../types';
import { translations } from '../../lib/i18n';
import { generateUUID } from '../../lib/db';

interface MandiPricesViewProps {
  prices: MandiPrice[];
  alerts: PriceAlert[];
  language: Language;
  onAddAlert: (alert: PriceAlert) => Promise<void>;
  onRemoveAlert: (alertId: string) => Promise<void>;
}

export const MandiPricesView: React.FC<MandiPricesViewProps> = ({
  prices,
  alerts,
  language,
  onAddAlert,
  onRemoveAlert
}) => {
  const t = translations[language];

  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [selectedMarketForTrend, setSelectedMarketForTrend] = useState<MandiPrice | null>(prices[0] || null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('2450');
  const [alertCommodity, setAlertCommodity] = useState<string>('Paddy (వరి / धान)');
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string>('');

  const commodities = ['all', 'Paddy', 'Groundnut', 'Cotton', 'Chilli'];

  const filteredPrices = selectedCommodity === 'all'
    ? prices
    : prices.filter(p => p.commodity.toLowerCase().includes(selectedCommodity.toLowerCase()));

  const handleCreateAlert = async () => {
    const target = parseInt(alertTargetPrice, 10);
    if (!target || target <= 0) return;

    const newAlert: PriceAlert = {
      id: generateUUID(),
      commodity: alertCommodity,
      market_name: 'Warangal Mandi',
      target_price: target,
      direction: 'above',
      active: true,
      created_at: new Date().toISOString()
    };

    await onAddAlert(newAlert);
    setIsAlertModalOpen(false);
    setAlertSuccessMsg(t.alertSetSuccess);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setAlertSuccessMsg(''), 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title & Set Alert Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
            {t.mandiTitle}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {t.mandiSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAlertModalOpen(true)}
          style={{
            minHeight: '42px',
            padding: '6px 14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
          }}
        >
          <Bell size={16} />
          <span>{t.setAlert}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {alertSuccessMsg && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#065f46',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} color="#059669" />
          <span>{alertSuccessMsg}</span>
        </div>
      )}

      {/* Commodity Filters */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
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

      {/* 7-Day Trend Interactive Chart Card */}
      {selectedMarketForTrend && (
        <div className="farm-card elevated" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                {t.sevenDayTrend}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {selectedMarketForTrend.commodity.split('/')[0]} @ {selectedMarketForTrend.market_name.split('(')[0]}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
                ₹{selectedMarketForTrend.modal_price.toLocaleString('en-IN')}
              </div>
              <span className={`price-delta ${selectedMarketForTrend.trend >= 0 ? 'up' : 'down'}`}>
                {selectedMarketForTrend.trend >= 0 ? `+₹${selectedMarketForTrend.trend}` : `-₹${Math.abs(selectedMarketForTrend.trend)}`}
              </span>
            </div>
          </div>

          {/* Lightweight High-Performance SVG Line Chart */}
          <div style={{ width: '100%', height: '140px', marginTop: '10px' }}>
            <svg viewBox="0 0 320 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="320" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="320" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />

              {/* Compute coordinates for 7 points */}
              {(() => {
                const history = selectedMarketForTrend.history_7d;
                if (!history || history.length < 2) return null;
                const minVal = Math.min(...history.map(h => h.price)) * 0.98;
                const maxVal = Math.max(...history.map(h => h.price)) * 1.02;
                const range = maxVal - minVal || 1;

                const pts = history.map((h, i) => {
                  const x = (i / (history.length - 1)) * 310 + 5;
                  const y = 105 - ((h.price - minVal) / range) * 85;
                  return { x, y, price: h.price, date: h.date };
                });

                const polyPoints = pts.map(p => `${p.x},${p.y}`).join(' ');
                const fillPoints = `${pts[0].x},115 ${polyPoints} ${pts[pts.length - 1].x},115`;

                return (
                  <>
                    <polygon points={fillPoints} fill="url(#trendGradient)" />
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
                        <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#047857" strokeWidth="2.5" />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          fontSize="8"
                          fontWeight="700"
                          fill="#0f172a"
                          textAnchor="middle"
                        >
                          ₹{p.price}
                        </text>
                        <text
                          x={p.x}
                          y="118"
                          fontSize="7.5"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {p.date.split(' ')[0]}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '12px' }}>
            {language === 'te' ? 'ధరల వివరాల కోసం కింద ఉన్న మార్కెట్‌పై నొక్కండి' : language === 'hi' ? 'विवरण के लिए नीचे दी गई मंडी पर टैप करें' : 'Tap any mandi below to inspect its 7-day trend'}
          </div>
        </div>
      )}

      {/* Nearby Mandi Prices Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredPrices.map((item) => {
          const isSelected = selectedMarketForTrend?.id === item.id;
          return (
            <div
              key={item.id}
              className={`mandi-item ${isSelected ? 'elevated' : ''}`}
              onClick={() => setSelectedMarketForTrend(item)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? '#047857' : '#e2e8f0',
                background: isSelected ? '#f0fdf4' : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    {item.commodity}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={13} color="#047857" />
                    <span>{item.market_name}</span>
                    <span style={{ color: '#047857', fontWeight: 700 }}>• {item.distance_km} km {t.distance}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="price-stat-pill">
                    ₹{item.modal_price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.perQuintal}</div>
                </div>
              </div>

              {/* Min - Max & Trend comparison strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isSelected ? '#ffffff' : '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  {t.minMaxPrice}: <strong style={{ color: '#0f172a' }}>₹{item.min_price} - ₹{item.max_price}</strong>
                </div>

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

      {/* Active Price Alerts Section */}
      <div className="farm-card" style={{ marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BellRing size={16} color="#d97706" />
            <span>{t.targetPriceAlert} ({alerts.length})</span>
          </div>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#047857',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + {t.setAlert}
          </button>
        </div>

        {alerts.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>
            {language === 'te' ? 'ధర అలర్టులు లేవు. లక్ష్య ధర కోసం అలర్ట్ సెట్ చేయండి.' : language === 'hi' ? 'कोई अलर्ट सक्रिय नहीं है। अलर्ट सेट करें।' : 'No price alerts set. Tap to create one!'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {alerts.map((al) => (
              <div
                key={al.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#fffbeb',
                  borderRadius: '10px',
                  border: '1px solid #fde68a'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#78350f' }}>
                    {al.commodity.split('/')[0]} @ {al.market_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#92400e' }}>
                    Notify when &gt;= ₹{al.target_price.toLocaleString('en-IN')}/qtl
                  </div>
                </div>
                <button
                  onClick={() => onRemoveAlert(al.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#991b1b',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Remove alert"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set Price Alert Modal */}
      {isAlertModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAlertModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>
                {t.setAlert}
              </h2>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {language === 'te' ? 'మీ పంట మార్కెట్లో ఆశించిన రేటుకు చేరుకున్నప్పుడు వెంటనే సమాచారం అందుకోండి.' : language === 'hi' ? 'जब मंडी में आपकी फसल का भाव लक्ष्य तक पहुंचेगा, आपको नोटिफिकेशन मिलेगा।' : 'Get notified as soon as your crop hits your desired modal price in nearby mandis.'}
            </p>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                {t.selectCrop}
              </label>
              <select
                value={alertCommodity}
                onChange={(e) => setAlertCommodity(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}
              >
                {prices.map(p => (
                  <option key={p.id} value={p.commodity}>{p.commodity}</option>
                ))}
              </select>
            </div>

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
                  fontSize: '1.3rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: '#064e3b'
                }}
              />
            </div>

            <button
              onClick={handleCreateAlert}
              style={{
                minHeight: '50px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.02rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              <Check size={20} strokeWidth={3} />
              <span>Confirm & Activate Alert</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
