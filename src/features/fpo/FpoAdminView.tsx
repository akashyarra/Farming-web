import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Package,
  Layers,
  Phone,
  Search,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/i18n';

interface FpoAdminViewProps {
  language: Language;
  onSwitchToFarmer: () => void;
}

interface FarmerMember {
  id: string;
  name: string;
  phone: string;
  village: string;
  acres: number;
  primaryCrop: string;
  expectedYield: string;
  status: 'Ready to Harvest' | 'Vegetative' | 'Flowering';
}

const mockFarmers: FarmerMember[] = [
  {
    id: 'f-1',
    name: 'Ravi Kumar (రవి కుమార్)',
    phone: '9848022334',
    village: 'Atmakur',
    acres: 3,
    primaryCrop: 'Paddy (BPT 5204)',
    expectedYield: '75 Quintals',
    status: 'Flowering'
  },
  {
    id: 'f-2',
    name: 'Venkat Reddy',
    phone: '9440112233',
    village: 'Parkal',
    acres: 4.5,
    primaryCrop: 'Groundnut (K-6)',
    expectedYield: '54 Quintals',
    status: 'Ready to Harvest'
  },
  {
    id: 'f-3',
    name: 'Srinivas Goud',
    phone: '9849223344',
    village: 'Atmakur',
    acres: 2,
    primaryCrop: 'Paddy',
    expectedYield: '48 Quintals',
    status: 'Flowering'
  },
  {
    id: 'f-4',
    name: 'Mallaiah Nayak',
    phone: '9441556677',
    village: 'Geesugonda',
    acres: 5,
    primaryCrop: 'Cotton',
    expectedYield: '35 Quintals',
    status: 'Vegetative'
  },
  {
    id: 'f-5',
    name: 'Anjaiah Boya',
    phone: '9848778899',
    village: 'Dharmasagar',
    acres: 3.5,
    primaryCrop: 'Chilli',
    expectedYield: '42 Quintals',
    status: 'Ready to Harvest'
  }
];

export const FpoAdminView: React.FC<FpoAdminViewProps> = ({ language, onSwitchToFarmer }) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [calledFarmerId, setCalledFarmerId] = useState<string | null>(null);

  const filtered = mockFarmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.primaryCrop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (id: string) => {
    setCalledFarmerId(id);
    setTimeout(() => setCalledFarmerId(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* FPO Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #334155'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              Farmer Producer Organization (FPO)
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: '2px 0' }}>
              Kakatiya Rythu Samakhya Cluster
            </h1>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Coordinator: Suresh Babu (Reg: FPO-TS-WRG-2024)
            </div>
          </div>

          <button
            onClick={onSwitchToFarmer}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid #38bdf8',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Back to Farmer App
          </button>
        </div>
      </div>

      {/* Cluster Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div className="farm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Total Farmers</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            148 Farmers
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Across 8 panchayats</div>
        </div>

        <div className="farm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
            <Layers size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Total Cultivated Land</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            420 Acres
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>72% Paddy, 18% Groundnut</div>
        </div>

        <div className="farm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <Package size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Projected Harvest</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            895 Tonnes
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Harvest starts in 3 weeks</div>
        </div>

        <div className="farm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Collective Bonus</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            +₹110/qtl
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bulk buyer premium</div>
        </div>
      </div>

      {/* Collective Bulk Selling Notice */}
      <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '14px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#064e3b' }}>
            Paddy Collective Tender Open
          </div>
          <div style={{ fontSize: '0.74rem', color: '#047857' }}>
            ITC & Rice Millers offer ₹2,510/qtl for 500+ tonnes lot. Target met: 62%
          </div>
        </div>
        <button
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            background: '#047857',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          View Bid
        </button>
      </div>

      {/* Farmer Directory Search */}
      <div className="farm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>
            Registered Farmers Directory ({filtered.length})
          </h3>
        </div>

        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by farmer name, village, or crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((fm) => (
            <div
              key={fm.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                  {fm.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  📍 {fm.village} • {fm.acres} Acres • {fm.primaryCrop}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
                  Est. Yield: {fm.expectedYield} • Status: {fm.status}
                </div>
              </div>

              <button
                onClick={() => handleCall(fm.id)}
                style={{
                  minHeight: '34px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: calledFarmerId === fm.id ? '#047857' : '#e2e8f0',
                  color: calledFarmerId === fm.id ? '#ffffff' : '#1e293b',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <Phone size={13} />
                <span>{calledFarmerId === fm.id ? 'Calling...' : fm.phone}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
