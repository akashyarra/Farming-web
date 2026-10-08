import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Globe,
  MapPin,
  Check,
  Wheat,
  Sprout,
  Users
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../../types';
import { translations } from '../../lib/i18n';

interface LoginOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCompleteProfile: (profile: Partial<UserProfile>) => void;
}

export const LoginOnboardingModal: React.FC<LoginOnboardingModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onCompleteProfile
}) => {
  const t = translations[language];

  const [step, setStep] = useState<'login' | 'otp' | 'profile'>('login');
  const [phoneNumber, setPhoneNumber] = useState<string>('9848022334');
  const [otp, setOtp] = useState<string>('4821');
  const [name, setName] = useState<string>('Ravi Kumar');
  const [acres, setAcres] = useState<number>(3);
  const [district, setDistrict] = useState<string>('Warangal');
  const [village, setVillage] = useState<string>('Atmakur');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy', 'Groundnut']);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    setStep('profile');
  };

  const handleFinishOnboarding = () => {
    onCompleteProfile({
      phone: phoneNumber,
      name,
      acres,
      district,
      village,
      crops: selectedCrops,
      isLoggedIn: true,
      role: 'farmer'
    });
    onClose();
  };

  const handleQuickDemoFarmer = () => {
    onCompleteProfile({
      name: 'Ravi Kumar (రవి కుమార్)',
      phone: '9848022334',
      district: 'Warangal',
      village: 'Atmakur',
      acres: 3,
      crops: ['Paddy', 'Groundnut'],
      role: 'farmer',
      isLoggedIn: true
    });
    onClose();
  };

  const handleQuickDemoFpo = () => {
    onCompleteProfile({
      name: 'Suresh Babu (FPO Coordinator)',
      phone: '9440112233',
      district: 'Warangal',
      village: 'Kakatiya FPO Cluster',
      acres: 420,
      crops: ['Paddy', 'Groundnut', 'Cotton'],
      role: 'fpo',
      isLoggedIn: true
    });
    onClose();
  };

  const cropOptions = ['Paddy', 'Groundnut', 'Cotton', 'Chilli', 'Tomato', 'Maize'];

  const toggleCrop = (c: string) => {
    if (selectedCrops.includes(c)) {
      setSelectedCrops(selectedCrops.filter(item => item !== c));
    } else {
      setSelectedCrops([...selectedCrops, c]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'center', padding: '16px' }}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>
              {t.welcomeTitle}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {step === 'login' ? 'Simple OTP sign-in (No password)' : step === 'otp' ? 'Enter 4-digit SMS code' : 'Setup your farm details'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Phone Login */}
        {step === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {/* Language Selection */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                {t.selectLanguage}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {(['en', 'te', 'hi'] as Language[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onLanguageChange(l)}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      border: language === l ? '2px solid #047857' : '1px solid #cbd5e1',
                      background: language === l ? '#ecfdf5' : '#ffffff',
                      color: language === l ? '#047857' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {l === 'en' ? 'English' : l === 'te' ? 'తెలుగు' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile input */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                {t.phoneLabel}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '0 12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginRight: '6px' }}>+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98480 22334"
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    outline: 'none',
                    fontFamily: 'var(--font-heading)'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              style={{
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.96rem',
                cursor: 'pointer'
              }}
            >
              Send OTP via SMS
            </button>

            {/* Quick Demo Logins for Testing */}
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginBottom: '8px' }}>
                — Instant 1-Tap Demo Testing —
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={handleQuickDemoFarmer}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #10b981',
                    background: '#f0fdf4',
                    color: '#065f46',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Wheat size={16} />
                  <span>{t.demoLoginFarmer}</span>
                </button>
                <button
                  onClick={handleQuickDemoFpo}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #38bdf8',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={16} />
                  <span>{t.demoLoginFpo}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            <p style={{ fontSize: '0.8rem', color: '#334155' }}>
              We sent a 4-digit code to <strong>+91 {phoneNumber}</strong>
            </p>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                {t.enterOtp}
              </label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #047857',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '8px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              style={{
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.96rem',
                cursor: 'pointer'
              }}
            >
              {t.verifyLogin}
            </button>
          </div>
        )}

        {/* Step 3: Farmer Onboarding Profile */}
        {step === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>Farmer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>{t.acresLabel}</label>
              <input
                type="number"
                value={acres}
                onChange={(e) => setAcres(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Crops Cultivated
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cropOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCrop(c)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: selectedCrops.includes(c) ? '2px solid #047857' : '1px solid #cbd5e1',
                      background: selectedCrops.includes(c) ? '#ecfdf5' : '#ffffff',
                      color: selectedCrops.includes(c) ? '#047857' : '#334155',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {c} {selectedCrops.includes(c) ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              style={{
                minHeight: '48px',
                borderRadius: '12px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.96rem',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Start Using KisanSetu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
