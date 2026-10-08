import React, { useState } from 'react';
import {
  Landmark,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, SchemeInfo, UserProfile } from '../../types';
import { translations } from '../../lib/i18n';
import { initialSchemes } from '../../lib/db';

interface SchemesViewProps {
  user: UserProfile;
  language: Language;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ user, language }) => {
  const t = translations[language];

  const [schemes] = useState<SchemeInfo[]>(initialSchemes);
  const [testedSchemeId, setTestedSchemeId] = useState<string | null>(null);

  const handleTestEligibility = (id: string) => {
    setTestedSchemeId(id);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
          {t.govSchemesTitle}
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          {language === 'te' ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల రైతు పథకాలు & సబ్సిడీల అర్హత' : language === 'hi' ? 'केंद्रीय एवं राज्य सरकार की किसान योजनाएं और सब्सिडी' : 'Verified Central & State agriculture subsidies for your landholding'}
        </p>
      </div>

      {/* Profile quick match badge */}
      <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '10px 14px', fontSize: '0.78rem', color: '#065f46' }}>
        <strong>Current Profile Match:</strong> {user.acres} Acres in {user.district}, {user.state} (Small & Marginal Category)
      </div>

      {/* Schemes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schemes.map((sch) => {
          const isTested = testedSchemeId === sch.id;

          return (
            <div key={sch.id} className="farm-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '99px' }}>
                    {sch.category}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                    {sch.name}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Provided by: {sch.provider}
                  </div>
                </div>

                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textAlign: 'right'
                  }}
                >
                  {sch.benefit}
                </div>
              </div>

              {/* Eligibility description */}
              <div style={{ fontSize: '0.78rem', color: '#334155', margin: '10px 0', lineHeight: 1.4 }}>
                <strong>Eligibility:</strong> {sch.eligibility}
              </div>

              {/* Required Documents */}
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '2px' }}>
                  Required Documents:
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {sch.doc_required.join(' • ')}
                </div>
              </div>

              {/* Actions & Eligibility Test */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleTestEligibility(sch.id)}
                  style={{
                    minHeight: '38px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isTested ? '#047857' : '#f1f5f9',
                    color: isTested ? '#ffffff' : '#064e3b',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isTested ? (
                    <>
                      <CheckCircle size={15} />
                      <span>{t.eligibleBadge} (100% Match)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>{t.checkEligibility}</span>
                    </>
                  )}
                </button>

                <a
                  href={sch.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    textDecoration: 'none'
                  }}
                >
                  <span>Official Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
