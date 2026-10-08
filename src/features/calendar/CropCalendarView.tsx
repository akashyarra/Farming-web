import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Sun,
  Droplets,
  Clock,
  Sparkles
} from 'lucide-react';
import { Language, FarmCrop } from '../../types';
import { translations } from '../../lib/i18n';

interface CropCalendarViewProps {
  crops: FarmCrop[];
  language: Language;
  onToggleTask: (cropId: string, taskId: string) => void;
}

export const CropCalendarView: React.FC<CropCalendarViewProps> = ({
  crops,
  language,
  onToggleTask
}) => {
  const t = translations[language];

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');

  const activeCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const stages = [
    { name: 'Sowing (నాట్లు)', range: 'Days 1-20', done: true },
    { name: 'Vegetative (శాకీయ దశ)', range: 'Days 21-50', done: true },
    { name: 'Panicle / Flowering (కంకి దశ)', range: 'Days 51-90', active: true },
    { name: 'Grain Filling (గింజ పాలుపోసుకునే దశ)', range: 'Days 91-110' },
    { name: 'Harvesting (కోత)', range: 'Days 111-125' }
  ];

  if (!activeCrop) return null;

  const progressPercent = Math.min(100, Math.round((activeCrop.days_passed / activeCrop.total_days) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
          {t.navCalendar}
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          {language === 'te' ? 'విత్తనం నుండి కోత వరకు సమయ పట్టిక & సలహాలు' : language === 'hi' ? 'बुवाई से कटाई तक की समय सारिणी' : 'Sowing-to-harvest lifecycle & agronomist reminders'}
        </p>
      </div>

      {/* Crop Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {crops.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`preset-chip ${selectedCropId === c.id ? 'active' : ''}`}
            onClick={() => setSelectedCropId(c.id)}
          >
            <Sprout size={16} />
            <span>{c.crop_name.split('/')[0]} ({c.variety})</span>
          </button>
        ))}
      </div>

      {/* Progress Card */}
      <div className="farm-card elevated" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
              {activeCrop.variety}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              {activeCrop.stage}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              Day {activeCrop.days_passed} <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>/ {activeCrop.total_days}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ecfdf5' }}>
              {progressPercent}% completed
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '99px', overflow: 'hidden', margin: '10px 0' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#34d399',
              borderRadius: '99px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#d1fae5' }}>
          <span>Sown: {activeCrop.sowing_date}</span>
          <span>Target Harvest: {activeCrop.expected_harvest}</span>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="farm-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          Growth Stages
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stages.map((st, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: st.active ? '#ecfdf5' : st.done ? '#f8fafc' : '#ffffff',
                border: st.active ? '1.5px solid #047857' : '1px solid #e2e8f0'
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: st.done ? '#047857' : st.active ? '#10b981' : '#e2e8f0',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                {st.done ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: st.active ? '#064e3b' : '#334155' }}>
                  {st.name} {st.active ? '★ Current' : ''}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{st.range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Checklist for this Crop */}
      <div className="farm-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
          Current Stage Tasks
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeCrop.current_tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(activeCrop.id, task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                border: task.done ? '1px solid #e2e8f0' : '1px solid #fed7aa',
                background: task.done ? '#f8fafc' : '#fffbeb',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: task.done ? '2px solid #047857' : '2px solid #d97706',
                  background: task.done ? '#047857' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                {task.done && <CheckCircle2 size={16} strokeWidth={3} />}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: task.done ? '#94a3b8' : '#0f172a',
                    textDecoration: task.done ? 'line-through' : 'none'
                  }}
                >
                  {task.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Scheduled: {task.due}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
