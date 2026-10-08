import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Wheat,
  Droplets,
  Bug,
  Sparkles,
  Shovel,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  Filter
} from 'lucide-react';
import {
  Language,
  FarmActivity,
  FarmCrop,
  ActivityType
} from '../../types';
import { translations } from '../../lib/i18n';

interface FarmDiaryViewProps {
  activities: FarmActivity[];
  crops: FarmCrop[];
  language: Language;
  onOpenQuickLog: (tab?: 'expense' | 'activity') => void;
  onDeleteActivity: (id: string) => Promise<void>;
}

export const FarmDiaryView: React.FC<FarmDiaryViewProps> = ({
  activities,
  crops,
  language,
  onOpenQuickLog,
  onDeleteActivity
}) => {
  const t = translations[language];

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');

  const filteredActivities = selectedCropFilter === 'all'
    ? activities
    : activities.filter(a => a.crop_id === selectedCropFilter);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'irrigation':
        return <Droplets size={18} color="#0284c7" />;
      case 'spraying':
        return <Bug size={18} color="#e11d48" />;
      case 'fertilizer':
        return <Sparkles size={18} color="#d97706" />;
      case 'weeding':
        return <Shovel size={18} color="#854d0e" />;
      case 'sowing':
        return <Wheat size={18} color="#059669" />;
      case 'harvest':
        return <Calendar size={18} color="#16a34a" />;
      default:
        return <BookOpen size={18} color="#475569" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title & Log Activity Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
            {t.navDiary}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {language === 'te' ? 'పంట పనుల నమోదు • ఆఫ్‌లైన్ లో భద్రపరచబడుతుంది' : language === 'hi' ? 'खेत के काम का रिकॉर्ड • सुरक्षित और ऑफलाइन' : 'Chronological field activities & farm journal'}
          </p>
        </div>

        <button
          onClick={() => onOpenQuickLog('activity')}
          style={{
            minHeight: '42px',
            padding: '6px 14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>{t.logActivity}</span>
        </button>
      </div>

      {/* Filter by Crop */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          className={`preset-chip ${selectedCropFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCropFilter('all')}
        >
          {t.filterAll}
        </button>
        {crops.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`preset-chip ${selectedCropFilter === c.id ? 'active' : ''}`}
            onClick={() => setSelectedCropFilter(c.id)}
          >
            {c.crop_name.split('/')[0]}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="farm-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <BookOpen size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155' }}>
            {language === 'te' ? 'ఎలాంటి పనులు నమోదు చేయలేదు' : language === 'hi' ? 'कोई कार्य दर्ज नहीं किया गया' : 'No activities logged yet'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            {language === 'te' ? 'పై బటన్ నొక్కి విత్తడం, నీరు లేదా మందుల పని నమోదు చేయండి' : language === 'hi' ? 'ऊपर बटन दबाकर बुवाई, सिंचाई या कीटनाशक कार्य दर्ज करें' : 'Tap the button above to log sowing, spray, or irrigation'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="farm-card"
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getActivityIcon(act.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>
                    {act.type} • {act.crop_name.split('/')[0]}
                  </div>

                  {/* Sync status indicator badge */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      background: act.synced ? '#ecfdf5' : '#fef3c7',
                      color: act.synced ? '#047857' : '#b45309'
                    }}
                  >
                    {act.synced ? (
                      <>
                        <CheckCircle size={10} /> Saved
                      </>
                    ) : (
                      <>
                        <Clock size={10} /> Pending
                      </>
                    )}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                  📅 {act.date} {act.cost ? `• Cost: ₹${act.cost.toLocaleString('en-IN')}` : ''}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '6px', lineHeight: 1.4 }}>
                  {act.notes}
                </div>
              </div>

              <button
                onClick={() => onDeleteActivity(act.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="Delete entry"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
