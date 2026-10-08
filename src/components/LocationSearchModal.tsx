import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Compass,
  CheckCircle2,
  Navigation,
  Globe,
  Building,
  Sparkles
} from 'lucide-react';
import {
  ALL_INDIA_LOCATIONS,
  IndianLocation,
  searchIndianLocations
} from '../lib/locationService';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: IndianLocation;
  onSelectLocation: (loc: IndianLocation) => void;
  onDetectGPS: () => void;
  isDetecting: boolean;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  onDetectGPS,
  isDetecting
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');

  if (!isOpen) return null;

  const states = [
    'all',
    'Telangana',
    'Andhra Pradesh',
    'Maharashtra',
    'Madhya Pradesh',
    'Punjab',
    'Haryana',
    'Gujarat',
    'Rajasthan',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh'
  ];

  const searchResults = searchIndianLocations(query).filter(loc => {
    if (selectedStateFilter === 'all') return true;
    return loc.state.toLowerCase() === selectedStateFilter.toLowerCase();
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'center', padding: '16px' }}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          maxHeight: '88vh',
          borderRadius: '24px',
          padding: '24px',
          background: '#ffffff'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={22} color="#047857" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
                All-India Location Explorer
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Automatic geolocation active. Search any Indian district or market hub for live weather & APMC mandi rates.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Location Card with Auto GPS button */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Currently Active Location
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              📍 {selectedLocation.name}, {selectedLocation.state}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#ecfdf5', opacity: 0.9 }}>
              Coordinates: {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lon.toFixed(4)}° E
            </div>
          </div>

          <button
            onClick={onDetectGPS}
            disabled={isDetecting}
            style={{
              padding: '8px 16px',
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
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Compass size={16} />
            <span>{isDetecting ? 'Detecting...' : 'Auto-Detect GPS'}</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            placeholder="Type district name (e.g. Warangal, Guntur, Nashik, Indore, Khanna, Rajkot, Hubli)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: '12px',
              border: '2px solid #cbd5e1',
              fontSize: '0.92rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        {/* State Filter Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {states.map((st) => (
            <button
              key={st}
              type="button"
              className={`preset-chip ${selectedStateFilter === st ? 'active' : ''}`}
              onClick={() => setSelectedStateFilter(st)}
              style={{ fontSize: '0.76rem', padding: '4px 10px', minHeight: '34px' }}
            >
              {st === 'all' ? 'All States' : st}
            </button>
          ))}
        </div>

        {/* List of Matching Indian Locations */}
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Available Districts & Market Centers ({searchResults.length}):
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              maxHeight: '260px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}
          >
            {searchResults.map((loc) => {
              const isSelected = selectedLocation.name === loc.name && selectedLocation.state === loc.state;

              return (
                <div
                  key={`${loc.name}-${loc.state}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: isSelected ? '#ecfdf5' : '#f8fafc',
                    border: isSelected ? '2px solid #047857' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#064e3b' : '#0f172a' }}>
                      {loc.name}
                    </span>
                    {isSelected && <CheckCircle2 size={16} color="#047857" />}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {loc.district} • <strong style={{ color: '#047857' }}>{loc.state}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
