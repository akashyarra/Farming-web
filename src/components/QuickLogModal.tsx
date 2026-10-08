import React, { useState } from 'react';
import {
  X,
  Mic,
  MicOff,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  Wheat,
  Tractor,
  Bug,
  Truck,
  Banknote,
  Shovel,
  Droplets,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Language,
  FarmCrop,
  TransactionCategory,
  ActivityType
} from '../types';
import { translations } from '../lib/i18n';
import { speechAssistant } from '../lib/speech';
import { generateUUID } from '../lib/db';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: FarmCrop[];
  language: Language;
  onSaveExpense: (entry: {
    id: string;
    crop_id: string;
    crop_name: string;
    type: 'expense' | 'income';
    category: TransactionCategory;
    amount: number;
    note: string;
    date: string;
  }) => Promise<void>;
  onSaveActivity: (entry: {
    id: string;
    crop_id: string;
    crop_name: string;
    type: ActivityType;
    date: string;
    notes: string;
    cost?: number;
  }) => Promise<void>;
  initialTab?: 'expense' | 'activity';
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  crops,
  language,
  onSaveExpense,
  onSaveActivity,
  initialTab = 'expense'
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<'expense' | 'activity'>(initialTab);
  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('labor');
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('irrigation');
  const [amountStr, setAmountStr] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const handleKeypadPress = (val: string) => {
    if (val === 'clear') {
      setAmountStr('');
    } else if (val === 'backspace') {
      setAmountStr(prev => prev.slice(0, -1));
    } else if (val.startsWith('+')) {
      const add = parseInt(val.replace('+', ''), 10);
      const current = parseInt(amountStr || '0', 10);
      setAmountStr((current + add).toString());
    } else {
      if (amountStr.length < 7) {
        setAmountStr(prev => (prev === '0' ? val : prev + val));
      }
    }
  };

  const startVoiceDictation = () => {
    if (isListening) {
      speechAssistant.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceTranscript('Listening... మాట్లాడండి / बोलिए...');

    speechAssistant.startListening(
      language,
      (res) => {
        setVoiceTranscript(res.text);
        if (res.amount) {
          setAmountStr(res.amount.toString());
        }
        setNote(res.text);
      },
      () => {
        setIsListening(false);
        setVoiceTranscript('Voice input paused');
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSave = async () => {
    const amount = parseInt(amountStr, 10) || 0;
    if (mode === 'expense' && amount <= 0) {
      alert(language === 'te' ? 'దయచేసి ఖర్చు మొత్తం నమోదు చేయండి' : language === 'hi' ? 'कृपया राशि दर्ज करें' : 'Please enter an amount');
      return;
    }

    setIsSaving(true);
    const id = generateUUID();
    const today = new Date().toISOString().split('T')[0];

    try {
      if (mode === 'expense') {
        const isHarvestSale = selectedCategory === 'harvest_sale';
        await onSaveExpense({
          id,
          crop_id: selectedCrop?.id || 'crop-paddy-1',
          crop_name: selectedCrop?.crop_name || 'Paddy',
          type: isHarvestSale ? 'income' : 'expense',
          category: selectedCategory,
          amount,
          note: note.trim() || `${selectedCategory} expense`,
          date: today
        });
      } else {
        await onSaveActivity({
          id,
          crop_id: selectedCrop?.id || 'crop-paddy-1',
          crop_name: selectedCrop?.crop_name || 'Paddy',
          type: selectedActivityType,
          date: today,
          notes: note.trim() || `${selectedActivityType} work done`,
          cost: amount > 0 ? amount : undefined
        });
      }

      // Trigger micro celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#059669', '#f59e0b', '#3b82f6']
      });

      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const categories: { key: TransactionCategory; label: string; icon: any }[] = [
    { key: 'labor', label: t.catLabor, icon: Users },
    { key: 'fertilizer', label: t.catFertilizer, icon: Sparkles },
    { key: 'seeds', label: t.catSeeds, icon: Wheat },
    { key: 'machinery', label: t.catMachinery, icon: Tractor },
    { key: 'pesticides', label: t.catPesticides, icon: Bug },
    { key: 'transport', label: t.catTransport, icon: Truck },
    { key: 'harvest_sale', label: t.catHarvestSale, icon: Banknote }
  ];

  const activityTypes: { key: ActivityType; label: string; icon: any }[] = [
    { key: 'irrigation', label: t.actIrrigation, icon: Droplets },
    { key: 'spraying', label: t.actSpraying, icon: Bug },
    { key: 'fertilizer', label: t.actFertilizer, icon: Sparkles },
    { key: 'weeding', label: t.actWeeding, icon: Shovel },
    { key: 'sowing', label: t.actSowing, icon: Wheat },
    { key: 'harvest', label: t.actHarvest, icon: Calendar }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
              {t.quickLogTitle}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {language === 'te' ? '15 సెకన్లలో శీఘ్ర నమోదు • ఆఫ్‌లైన్ లో పనిచేస్తుంది' : language === 'hi' ? '15 सेकंड में दर्ज करें • बिना इंटरनेट भी काम करेगा' : 'Record in under 15 seconds • Works offline'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector (Expense vs Farm Work) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setMode('expense')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: mode === 'expense' ? '#047857' : 'transparent',
              color: mode === 'expense' ? '#ffffff' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            {t.logExpense}
          </button>
          <button
            type="button"
            onClick={() => setMode('activity')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: mode === 'activity' ? '#047857' : 'transparent',
              color: mode === 'activity' ? '#ffffff' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            {t.logActivity}
          </button>
        </div>

        {/* Crop Selector Chips */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
            {t.selectCrop}
          </label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {crops.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`preset-chip ${selectedCropId === c.id ? 'active' : ''}`}
                onClick={() => setSelectedCropId(c.id)}
              >
                <Wheat size={16} />
                <span>{c.crop_name.split('/')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category / Work Selector Grid */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
            {mode === 'expense' ? t.selectCategory : 'Work Type'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {mode === 'expense'
              ? categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #047857' : '1px solid #e2e8f0',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#064e3b' : '#334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}
                    >
                      <Icon size={20} color={isSelected ? '#047857' : '#64748b'} />
                      <span style={{ textAlign: 'center' }}>{cat.label}</span>
                    </button>
                  );
                })
              : activityTypes.map((act) => {
                  const Icon = act.icon;
                  const isSelected = selectedActivityType === act.key;
                  return (
                    <button
                      key={act.key}
                      type="button"
                      onClick={() => setSelectedActivityType(act.key)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #047857' : '1px solid #e2e8f0',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#064e3b' : '#334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}
                    >
                      <Icon size={20} color={isSelected ? '#047857' : '#64748b'} />
                      <span style={{ textAlign: 'center' }}>{act.label}</span>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Amount Input with Voice button */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
              {mode === 'expense' ? t.amountLabel : 'Cost / Daily Wage (₹ optional)'}
            </label>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={startVoiceDictation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                background: isListening ? '#ef4444' : '#f0fdf4',
                color: isListening ? '#ffffff' : '#047857',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              <span>{isListening ? 'Stop' : t.voiceDictate}</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              border: '2px solid #cbd5e1',
              borderRadius: '14px',
              padding: '8px 16px',
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#064e3b',
              minHeight: '62px'
            }}
          >
            <span style={{ marginRight: '8px', color: '#94a3b8' }}>₹</span>
            <span style={{ flex: 1, letterSpacing: '1px' }}>
              {amountStr || <span style={{ color: '#cbd5e1' }}>0</span>}
            </span>
            {amountStr && (
              <button
                type="button"
                onClick={() => setAmountStr('')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {voiceTranscript && (
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', fontStyle: 'italic' }}>
              "{voiceTranscript}"
            </div>
          )}
        </div>

        {/* Quick Numeric Keypad (Crucial for low-literacy 15-second entry!) */}
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            {t.quickKeypad}
          </div>
          <div className="quick-keypad-grid">
            {['1', '2', '3', '+100'].map((val) => (
              <button
                key={val}
                type="button"
                className="keypad-num-btn"
                style={val.startsWith('+') ? { background: '#fef3c7', color: '#b45309' } : {}}
                onClick={() => handleKeypadPress(val)}
              >
                {val}
              </button>
            ))}
            {['4', '5', '6', '+500'].map((val) => (
              <button
                key={val}
                type="button"
                className="keypad-num-btn"
                style={val.startsWith('+') ? { background: '#fef3c7', color: '#b45309' } : {}}
                onClick={() => handleKeypadPress(val)}
              >
                {val}
              </button>
            ))}
            {['7', '8', '9', '+1000'].map((val) => (
              <button
                key={val}
                type="button"
                className="keypad-num-btn"
                style={val.startsWith('+') ? { background: '#fef3c7', color: '#b45309' } : {}}
                onClick={() => handleKeypadPress(val)}
              >
                {val}
              </button>
            ))}
            <button
              type="button"
              className="keypad-num-btn"
              onClick={() => handleKeypadPress('clear')}
              style={{ fontSize: '0.85rem', color: '#dc2626' }}
            >
              {t.clear}
            </button>
            <button type="button" className="keypad-num-btn" onClick={() => handleKeypadPress('0')}>
              0
            </button>
            <button type="button" className="keypad-num-btn" onClick={() => handleKeypadPress('backspace')}>
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              className="keypad-num-btn"
              style={{ background: '#ecfdf5', color: '#047857' }}
              onClick={() => handleKeypadPress('+5000')}
            >
              +5000
            </button>
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <input
            type="text"
            placeholder={language === 'te' ? 'గమనిక (ఉదా: 4 కూలీలు, డీజిల్)' : language === 'hi' ? 'विवरण (उदा: 4 मजदूर, यूरिया)' : 'Short note (e.g., 4 workers, diesel)'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '0.86rem'
            }}
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            minHeight: '52px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            color: '#ffffff',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.05rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(4, 120, 87, 0.35)',
            marginTop: '4px'
          }}
        >
          <Check size={20} strokeWidth={3} />
          <span>{isSaving ? t.saving : t.saveEntry}</span>
        </button>
      </div>
    </div>
  );
};
