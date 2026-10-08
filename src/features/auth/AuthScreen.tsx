import React, { useState } from 'react';
import {
  Sprout,
  Phone,
  ShieldCheck,
  Globe,
  MapPin,
  Check,
  Wheat,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  CloudSun,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Building,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile, UserRole } from '../../types';
import { translations } from '../../lib/i18n';
import { generateUUID } from '../../lib/db';

interface AuthScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onAuthSuccess: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  language,
  onLanguageChange,
  onAuthSuccess,
  onClose
}) => {
  const t = translations[language];

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Sign In State
  const [signInMethod, setSignInMethod] = useState<'otp' | 'pin'>('otp');
  const [loginPhone, setLoginPhone] = useState<string>('9848022334');
  const [loginPin, setLoginPin] = useState<string>('1234');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [loginOtp, setLoginOtp] = useState<string>('4821');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sign Up Multi-Step State
  const [signupStep, setSignupStep] = useState<number>(1); // 1: Contact, 2: Location, 3: Land & Crops
  const [regPhone, setRegPhone] = useState<string>('');
  const [regOtp, setRegOtp] = useState<string>('5914');
  const [regOtpVerified, setRegOtpVerified] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regState, setRegState] = useState<string>('Telangana');
  const [regDistrict, setRegDistrict] = useState<string>('Warangal');
  const [regVillage, setRegVillage] = useState<string>('Atmakur');
  const [regAcres, setRegAcres] = useState<number>(3);
  const [regSoilType, setRegSoilType] = useState<string>('Red Sandy Loam (ఎర్ర నేల)');
  const [regCrops, setRegCrops] = useState<string[]>(['Paddy', 'Groundnut']);
  const [regPin, setRegPin] = useState<string>('1234');

  // Available Crops for Selection
  const cropChoices = [
    { id: 'Paddy', label: 'Paddy / వరి / धान', icon: '🌾' },
    { id: 'Groundnut', label: 'Groundnut / వేరుశెనగ / मूंगफली', icon: '🥜' },
    { id: 'Cotton', label: 'Cotton / పత్తి / कपास', icon: '☁️' },
    { id: 'Chilli', label: 'Chilli / మిరప / मिर्च', icon: '🌶️' },
    { id: 'Tomato', label: 'Tomato / టమోటా / टमाटर', icon: '🍅' },
    { id: 'Maize', label: 'Maize / మొక్కజొన్న / मक्का', icon: '🌽' },
    { id: 'Soybean', label: 'Soybean / సోయాబీన్ / सोयाबीन', icon: '🌱' },
    { id: 'Turmeric', label: 'Turmeric / పసుపు / हल्दी', icon: '🟡' }
  ];

  const soilChoices = [
    'Red Sandy Loam (ఎర్ర నేల)',
    'Black Cotton Soil (నల్ల రేగడి)',
    'Clay Loam (బంక మన్ను)',
    'Alluvial River Bed (ఒండ్రు నేల)'
  ];

  const handleSendLoginOtp = () => {
    if (loginPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setCountdown(30);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Determine profile
      const isFpo = selectedRole === 'fpo' || loginPhone === '9440112233';
      const userProfile: UserProfile = {
        id: isFpo ? 'user-fpo-suresh' : 'user-ravi-01',
        phone: loginPhone,
        name: isFpo ? 'Suresh Babu (FPO Coordinator)' : 'Ravi Kumar (రవి కుమార్)',
        language,
        state: 'Telangana',
        district: 'Warangal',
        village: isFpo ? 'Kakatiya Cluster Office' : 'Atmakur',
        acres: isFpo ? 420 : 3,
        crops: isFpo ? ['Paddy', 'Groundnut', 'Cotton'] : ['Paddy', 'Groundnut'],
        soil_type: 'Red Sandy Loam',
        isLoggedIn: true,
        role: isFpo ? 'fpo' : 'farmer'
      };

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onAuthSuccess(userProfile);
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const newProfile: UserProfile = {
        id: generateUUID(),
        phone: regPhone || '9848123456',
        name: regName,
        language,
        state: regState,
        district: regDistrict,
        village: regVillage,
        acres: regAcres,
        crops: regCrops.length > 0 ? regCrops : ['Paddy'],
        soil_type: regSoilType,
        isLoggedIn: true,
        role: selectedRole
      };

      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onAuthSuccess(newProfile);
    }, 700);
  };

  const toggleCrop = (cId: string) => {
    if (regCrops.includes(cId)) {
      if (regCrops.length > 1) {
        setRegCrops(regCrops.filter(c => c !== cId));
      }
    } else {
      setRegCrops([...regCrops, cId]);
    }
  };

  const handleQuickDemoFarmer = () => {
    onAuthSuccess({
      id: 'user-ravi-01',
      phone: '9848022334',
      name: 'Ravi Kumar (రవి కుమార్)',
      language,
      state: 'Telangana',
      district: 'Warangal',
      village: 'Atmakur',
      acres: 3,
      crops: ['Paddy', 'Groundnut'],
      soil_type: 'Red Sandy Loam',
      isLoggedIn: true,
      role: 'farmer'
    });
  };

  const handleQuickDemoFpo = () => {
    onAuthSuccess({
      id: 'user-fpo-suresh',
      phone: '9440112233',
      name: 'Suresh Babu (FPO Coordinator)',
      language,
      state: 'Telangana',
      district: 'Warangal',
      village: 'Kakatiya Cluster Office',
      acres: 420,
      crops: ['Paddy', 'Groundnut', 'Cotton'],
      soil_type: 'Alluvial Loam',
      isLoggedIn: true,
      role: 'fpo'
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at 50% 0%, #0d3822 0%, #051a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        color: '#ffffff'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '28px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.45)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          overflow: 'hidden'
        }}
        className="auth-card-container"
      >
        {/* LEFT PANEL: Agritech Hero Showcase */}
        <div
          style={{
            background: 'linear-gradient(135deg, #052e16 0%, #064e3b 60%, #047857 100%)',
            color: '#ffffff',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          {/* Top Brand Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <Sprout size={26} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800 }}>
                  KisanSetu
                </div>
                <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
                  రైతు సేతు • किसान सेतु
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#f59e0b',
                  color: '#451a03',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                Smallholder Digital Portal
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
                {language === 'te'
                  ? 'రైతుల కోసం సులభమైన, నమ్మకమైన డిజిటల్ తోడ్పాటు'
                  : language === 'hi'
                  ? 'किसानों का विश्वसनीय डिजिटल कृषि साथी'
                  : 'Empowering 1 to 5 Acre Farmers with Live Agritech'}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#ecfdf5', marginTop: '10px', lineHeight: 1.5, opacity: 0.9 }}>
                {language === 'te'
                  ? 'ప్రత్యక్ష మార్కెట్ ధరలు, వాతావరణ వర్ష హెచ్చరికలు, 15 సెకన్లలో ఖర్చుల నమోదు & పంట లాభనష్టాల లెక్కలు — ఆఫ్‌లైన్‌లో కూడా పనిచేస్తుంది.'
                  : language === 'hi'
                  ? 'ताजा मंडी भाव, मौसम की बारिश चेतावनी, 15 सेकंड में खर्च डायरी और फसल मुनाफे का हिसाब — बिना इंटरनेट भी सक्रिय।'
                  : 'Track crop profit per acre, get live mandi prices in 3 taps, receive timely rain alerts, and log field work in under 15 seconds.'}
              </p>
            </div>

            {/* Feature Highlights List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color="#34d399" />
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  <strong>Live APMC Mandi Rates</strong> with 7-day modal trends & target price alerts
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudSun size={16} color="#fcd34d" />
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  <strong>Hyperlocal Rain & Spray Alerts</strong> via live GPS weather radar
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#60a5fa" />
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  <strong>100% Offline Capable</strong> — entries stay safe and auto-sync when connected
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.18)', paddingTop: '16px', marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#a7f3d0' }}>
              <span>🌾 Free for All Small Farmers</span>
              <span>🔒 Encrypted & Private</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login / Signup Interactive Forms */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top Bar: Language Switcher & Guest Close */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              {/* Sign In vs Sign Up Tab Toggle */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    background: authMode === 'signin' ? '#047857' : 'transparent',
                    color: authMode === 'signin' ? '#ffffff' : '#475569',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {language === 'te' ? 'లాగిన్ (Sign In)' : language === 'hi' ? 'लॉगिन करें' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupStep(1);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    background: authMode === 'signup' ? '#047857' : 'transparent',
                    color: authMode === 'signup' ? '#ffffff' : '#475569',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {language === 'te' ? 'నమోదు (Sign Up)' : language === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}
                </button>
              </div>

              {/* Language Switcher Pill */}
              <button
                type="button"
                onClick={() => {
                  const langs: Language[] = ['en', 'te', 'hi'];
                  const next = langs[(langs.indexOf(language) + 1) % langs.length];
                  onLanguageChange(next);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  color: '#064e3b',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Globe size={14} />
                <span>{language === 'en' ? 'English' : language === 'te' ? 'తెలుగు' : 'हिन्दी'}</span>
              </button>
            </div>

            {/* Role Toggle (Farmer vs FPO Coordinator) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Role:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('farmer')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: selectedRole === 'farmer' ? '2px solid #047857' : '1px solid #cbd5e1',
                    background: selectedRole === 'farmer' ? '#ecfdf5' : '#ffffff',
                    color: selectedRole === 'farmer' ? '#064e3b' : '#334155',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Wheat size={18} color={selectedRole === 'farmer' ? '#047857' : '#64748b'} />
                  <span>Smallholder Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('fpo')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: selectedRole === 'fpo' ? '2px solid #047857' : '1px solid #cbd5e1',
                    background: selectedRole === 'fpo' ? '#ecfdf5' : '#ffffff',
                    color: selectedRole === 'fpo' ? '#064e3b' : '#334155',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Users size={18} color={selectedRole === 'fpo' ? '#047857' : '#64748b'} />
                  <span>FPO Coordinator</span>
                </button>
              </div>
            </div>

            {/* ----------------- MODE A: SIGN IN SCREEN ----------------- */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    {language === 'te' ? 'రైతు లాగిన్' : language === 'hi' ? 'किसान लॉगिन' : 'Sign In to Your Farm'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    Enter your registered 10-digit mobile number to access your diary and mandi alerts.
                  </p>
                </div>

                {/* Method selector: OTP vs PIN */}
                <div style={{ display: 'flex', gap: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: signInMethod === 'otp' ? '#047857' : '#64748b' }}>
                    <input
                      type="radio"
                      name="signInMethod"
                      checked={signInMethod === 'otp'}
                      onChange={() => setSignInMethod('otp')}
                    />
                    <span>Phone OTP (Recommended)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: signInMethod === 'pin' ? '#047857' : '#64748b' }}>
                    <input
                      type="radio"
                      name="signInMethod"
                      checked={signInMethod === 'pin'}
                      onChange={() => setSignInMethod('pin')}
                    />
                    <span>4-Digit Security PIN</span>
                  </label>
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Mobile Number (10 digits)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '0 14px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#047857', marginRight: '8px' }}>+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98480 22334"
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        outline: 'none',
                        fontFamily: 'var(--font-heading)',
                        color: '#0f172a'
                      }}
                      required
                    />
                    {loginPhone.length === 10 && (
                      <CheckCircle2 size={18} color="#10b981" />
                    )}
                  </div>
                </div>

                {/* OTP Verification Box */}
                {signInMethod === 'otp' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                        Enter 4-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendLoginOtp}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#047857',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {otpSent ? `Resend OTP (${countdown}s)` : 'Send OTP via SMS'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        maxLength={4}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '2px solid #047857',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          letterSpacing: '10px',
                          outline: 'none',
                          fontFamily: 'var(--font-heading)',
                          background: '#f8fafc'
                        }}
                        placeholder="••••"
                        required
                      />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                      Test code <strong>4821</strong> is pre-filled for rapid evaluation.
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Enter 4-Digit Security PIN
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '0 14px' }}>
                      <KeyRound size={18} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={4}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        style={{
                          flex: 1,
                          padding: '12px 0',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          letterSpacing: '6px',
                          outline: 'none',
                          color: '#0f172a'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Sign In Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    minHeight: '50px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(4, 120, 87, 0.35)',
                    marginTop: '4px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Open Dashboard</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ----------------- MODE B: SIGN UP WIZARD ----------------- */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {language === 'te' ? 'కొత్త రైతు నమోదు' : language === 'hi' ? 'नया किसान पंजीकरण' : 'Create Farmer Account'}
                    </h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px' }}>
                      Step {signupStep} of 3
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Set up your farm profile to get personalized mandi rates and rain forecast advisories.
                  </p>
                </div>

                {/* Step Indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', margin: '4px 0' }}>
                  <div style={{ height: '4px', borderRadius: '2px', background: signupStep >= 1 ? '#047857' : '#e2e8f0' }} />
                  <div style={{ height: '4px', borderRadius: '2px', background: signupStep >= 2 ? '#047857' : '#e2e8f0' }} />
                  <div style={{ height: '4px', borderRadius: '2px', background: signupStep >= 3 ? '#047857' : '#e2e8f0' }} />
                </div>

                {/* SIGNUP STEP 1: Mobile & Verification */}
                {signupStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Mobile Number
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '0 12px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857', marginRight: '8px' }}>+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          style={{ flex: 1, padding: '10px 0', border: 'none', background: 'transparent', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Create 4-Digit Security PIN
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '6px', textAlign: 'center' }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#047857',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '6px'
                      }}
                    >
                      <span>Continue to Farmer Details</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* SIGNUP STEP 2: Name & Village Location */}
                {signupStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Farmer Full Name
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Reddy / రమేష్ రెడ్డి"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', fontWeight: 600 }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          State
                        </label>
                        <select
                          value={regState}
                          onChange={(e) => setRegState(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 600 }}
                        >
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Karnataka">Karnataka</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          District
                        </label>
                        <input
                          type="text"
                          value={regDistrict}
                          onChange={(e) => setRegDistrict(e.target.value)}
                          placeholder="Warangal"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 600 }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Village / Gram Panchayat
                      </label>
                      <input
                        type="text"
                        value={regVillage}
                        onChange={(e) => setRegVillage(e.target.value)}
                        placeholder="Atmakur / ఆత్మకూరు"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 600 }}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupStep(3)}
                        style={{ flex: 2, padding: '10px', borderRadius: '12px', border: 'none', background: '#047857', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <span>Next: Land & Crops</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* SIGNUP STEP 3: Land Acres, Soil & Crops */}
                {signupStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Landholding (Acres)
                        </label>
                        <input
                          type="number"
                          min={0.5}
                          max={50}
                          step={0.5}
                          value={regAcres}
                          onChange={(e) => setRegAcres(Number(e.target.value))}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Soil Type
                        </label>
                        <select
                          value={regSoilType}
                          onChange={(e) => setRegSoilType(e.target.value)}
                          style={{ width: '100%', padding: '10px 10px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          {soilChoices.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                        Select Your Cultivated Crops
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                        {cropChoices.map((c) => {
                          const isPicked = regCrops.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleCrop(c.id)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '10px',
                                border: isPicked ? '2px solid #047857' : '1px solid #cbd5e1',
                                background: isPicked ? '#ecfdf5' : '#ffffff',
                                color: isPicked ? '#064e3b' : '#334155',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                textAlign: 'left',
                                cursor: 'pointer'
                              }}
                            >
                              <span>{c.icon}</span>
                              <span style={{ flex: 1 }}>{c.id}</span>
                              {isPicked && <Check size={14} color="#047857" strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setSignupStep(2)}
                        style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          flex: 2,
                          padding: '12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.94rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(4, 120, 87, 0.35)'
                        }}
                      >
                        <Sparkles size={16} />
                        <span>Complete Registration</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* 1-Click Instant Demo Profiles for Rapid Testing */}
            <div style={{ marginTop: '22px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Instant 1-Click Test Access:
                </span>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Continue as Guest →
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleQuickDemoFarmer}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #10b981',
                    background: '#f0fdf4',
                    color: '#065f46',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Wheat size={16} />
                  <span>Farmer Ravi (3 Ac)</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoFpo}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #38bdf8',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={16} />
                  <span>FPO Coordinator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
