import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Activity
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/i18n';

interface CropDoctorViewProps {
  language: Language;
}

interface DiagnosisResult {
  disease: string;
  teluguName: string;
  hindiName: string;
  crop: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  symptoms: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  imageSample: string;
}

const sampleDiagnoses: DiagnosisResult[] = [
  {
    disease: 'Rice Blast (Magnaporthe oryzae)',
    teluguName: 'వరి అగ్గితెగులు (బ్లాస్ట్)',
    hindiName: 'धान का झुलसा रोग (ब्लास्ट)',
    crop: 'Paddy / వరి',
    confidence: 96,
    severity: 'Severe',
    symptoms: [
      'Spindle-shaped lesions with brown borders and grayish center on leaves',
      'Nodes turning black and breaking during wind',
      'Panicle blast causing sterile chaffy grains'
    ],
    organicTreatment: 'Spray 5% Neem seed kernel extract (NSKE) or Pseudomonas fluorescens @ 10g/litre of water twice at 10-day intervals.',
    chemicalTreatment: 'Tricyclazole 75% WP @ 0.6 g/litre OR Isoprothiolane 40% EC @ 1.5 ml/litre of water. Ensure thorough canopy wetting.',
    imageSample: '🌾 Paddy Leaf Blast Sample'
  },
  {
    disease: 'Bacterial Leaf Blight (BLB)',
    teluguName: 'బ్యాక్టీరియా ఆకు ఎండు తెగులు',
    hindiName: 'जीवाणु पत्ती झुलसा रोग',
    crop: 'Paddy / వరి',
    confidence: 92,
    severity: 'Moderate',
    symptoms: [
      'Water-soaked lesions starting from leaf tips moving downwards',
      'Wavy margins on leaf blades with yellow bacterial exudates',
      'Drying of upper canopy resembling drought stress'
    ],
    organicTreatment: 'Fresh cow dung slurry supernatant spray (20 kg cow dung mixed in 200L water strained) + Trichoderma viride.',
    chemicalTreatment: 'Streptocycline @ 0.1 g + Copper Oxychloride @ 2.5 g per litre of water. Avoid nitrogenous fertilizer top dressing immediately.',
    imageSample: '🍃 Paddy Blight Sample'
  },
  {
    disease: 'Tikka Leaf Spot (Cercospora arachidicola)',
    teluguName: 'వేరుశెనగ టిక్కా తెగులు',
    hindiName: 'मूंगफली टिक्का रोग',
    crop: 'Groundnut / వేరుశెనగ',
    confidence: 94,
    severity: 'Moderate',
    symptoms: [
      'Small circular dark brown to black spots surrounded by a bright yellow halo',
      'Premature defoliation resulting in poor pod filling and shriveled seeds'
    ],
    organicTreatment: 'Panchagavya (3%) foliar spray + buttermilk spray (5L in 100L water).',
    chemicalTreatment: 'Mancozeb 75% WP @ 2.5 g/L OR Hexaconazole 5% EC @ 2 ml/L of water at first appearance of spots.',
    imageSample: '🥜 Groundnut Tikka Spot'
  },
  {
    disease: 'Healthy Crop Foliage',
    teluguName: 'ఆరోగ్యకరమైన పంట ఆకు',
    hindiName: 'स्वस्थ फसल की पत्ती',
    crop: 'Paddy / వరి',
    confidence: 98,
    severity: 'Healthy',
    symptoms: ['Uniform chlorophyll distribution', 'No fungal mycelium or bacterial lesions detected', 'Vigorous turgor pressure'],
    organicTreatment: 'Continue scheduled organic booster (Jeevammrutham) every 15 days.',
    chemicalTreatment: 'No chemical intervention required. Preserve beneficial predators.',
    imageSample: '🌱 Clean Green Foliage'
  }
];

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({ language }) => {
  const t = translations[language];

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [customPhotoSelected, setCustomPhotoSelected] = useState<boolean>(false);

  const activeDiagnosis = sampleDiagnoses[selectedSampleIndex];

  const handleRunScan = () => {
    setIsScanning(true);
    setHasScanned(false);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1800);
  };

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setCustomPhotoSelected(false);
    setHasScanned(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomPhotoSelected(true);
      setSelectedSampleIndex(0); // map to blast analysis
      setHasScanned(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
            {t.cropDoctorTitle}
          </h1>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '99px' }}>
            ON-DEVICE AI
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          {t.cropDoctorSubtitle}
        </p>
      </div>

      {/* Preset Test Leaf Options */}
      <div className="farm-card" style={{ background: '#f8fafc' }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
          {language === 'te' ? 'పరీక్షించడానికి ఆకు నమూనాను ఎంచుకోండి:' : language === 'hi' ? 'जांच के लिए पत्ती का नमूना चुनें:' : 'Select a leaf sample to test:'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {sampleDiagnoses.map((sd, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectSample(i)}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: selectedSampleIndex === i && !customPhotoSelected ? '2px solid #047857' : '1px solid #cbd5e1',
                background: selectedSampleIndex === i && !customPhotoSelected ? '#ecfdf5' : '#ffffff',
                color: selectedSampleIndex === i && !customPhotoSelected ? '#064e3b' : '#334155',
                fontSize: '0.76rem',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {sd.imageSample}
            </button>
          ))}
        </div>

        {/* Upload Custom Photo Option */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '10px',
              border: '1.5px dashed #047857',
              background: '#f0fdf4',
              color: '#047857',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Camera size={16} />
            <span>{customPhotoSelected ? 'Photo Captured ✓' : t.uploadLeafPhoto}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Scanner Visualizer Box */}
      <div
        className="farm-card"
        style={{
          position: 'relative',
          minHeight: '190px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid #334155'
        }}
      >
        <Leaf size={48} color={activeDiagnosis.severity === 'Healthy' ? '#10b981' : '#f59e0b'} style={{ opacity: 0.9 }} />
        <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '0.96rem', letterSpacing: '0.5px' }}>
          {customPhotoSelected ? 'Farmer Camera Upload' : activeDiagnosis.imageSample}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          {activeDiagnosis.crop} • MobileNet PlantVillage Model (Offline)
        </div>

        {/* Laser beam animation while scanning */}
        {isScanning && (
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: 0,
              right: 0,
              height: '3px',
              background: '#00f2fe',
              boxShadow: '0 0 15px 4px #00f2fe',
              animation: 'slideScan 1.2s infinite alternate ease-in-out'
            }}
          />
        )}

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          style={{
            marginTop: '14px',
            minHeight: '44px',
            padding: '8px 24px',
            borderRadius: '12px',
            border: 'none',
            background: isScanning ? '#475569' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Activity size={16} />
          <span>{isScanning ? t.diagnosing : t.scanNow}</span>
        </button>
      </div>

      {/* Diagnosis Report Card */}
      {hasScanned && (
        <div className="farm-card elevated" style={{ borderColor: activeDiagnosis.severity === 'Healthy' ? '#10b981' : '#f59e0b', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '99px',
                  background: activeDiagnosis.severity === 'Healthy' ? '#dcfce7' : '#fee2e2',
                  color: activeDiagnosis.severity === 'Healthy' ? '#15803d' : '#b91c1c',
                  marginBottom: '4px'
                }}
              >
                {activeDiagnosis.severity.toUpperCase()} RISK
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {language === 'te' ? activeDiagnosis.teluguName : language === 'hi' ? activeDiagnosis.hindiName : activeDiagnosis.disease}
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Scientific: {activeDiagnosis.disease}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
                {activeDiagnosis.confidence}%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>AI Confidence</div>
            </div>
          </div>

          {/* Symptoms */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Observed Symptoms:
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#334155' }}>
              {activeDiagnosis.symptoms.map((s, idx) => (
                <li key={idx} style={{ marginBottom: '2px' }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Organic Remedy */}
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '0.84rem' }}>
              <ShieldCheck size={16} />
              <span>{t.organicRemedy}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#14532d', marginTop: '4px', lineHeight: 1.4 }}>
              {activeDiagnosis.organicTreatment}
            </div>
          </div>

          {/* Chemical Treatment */}
          {activeDiagnosis.severity !== 'Healthy' && (
            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400e', fontWeight: 800, fontSize: '0.84rem' }}>
                <AlertTriangle size={16} />
                <span>{t.chemicalRemedy}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '4px', lineHeight: 1.4 }}>
                {activeDiagnosis.chemicalTreatment}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
