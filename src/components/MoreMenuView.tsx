import React from 'react';
import {
  CalendarDays,
  Activity,
  Landmark,
  FileText,
  Users,
  Settings,
  HelpCircle,
  ExternalLink,
  PhoneCall,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../lib/i18n';
import { NavTab } from './BottomNav';

interface MoreMenuViewProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenReportModal: () => void;
  onOpenLoginModal: () => void;
  currentRole: UserRole;
  onToggleRole: () => void;
}

export const MoreMenuView: React.FC<MoreMenuViewProps> = ({
  language,
  onNavigate,
  onOpenReportModal,
  onOpenLoginModal,
  currentRole,
  onToggleRole
}) => {
  const t = translations[language];

  const menuSections = [
    {
      title: 'Agricultural Tools',
      items: [
        {
          id: 'calendar',
          label: t.navCalendar,
          desc: language === 'te' ? 'విత్తనం నుండి కోత వరకు కాలక్రమం' : language === 'hi' ? 'बुवाई से कटाई की समय सारिणी' : 'Sowing to harvest timeline & stage tasks',
          icon: CalendarDays,
          color: '#059669',
          action: () => onNavigate('calendar')
        },
        {
          id: 'cropdoctor',
          label: `${t.navCropDoctor} (AI)`,
          desc: language === 'te' ? 'ఆకు ఫోటోతో తెగుళ్ల నిర్ధారణ' : language === 'hi' ? 'पत्ती फोटो से रोग पहचान' : 'On-device leaf disease diagnosis & treatment',
          icon: Activity,
          color: '#0284c7',
          action: () => onNavigate('cropdoctor')
        },
        {
          id: 'schemes',
          label: t.navSchemes,
          desc: language === 'te' ? 'PM-కిసాన్ & రైతు సబ్సిడీలు' : language === 'hi' ? 'PM-किसान एवं अन्य सब्सिडी' : 'Instant subsidy & scheme eligibility check',
          icon: Landmark,
          color: '#d97706',
          action: () => onNavigate('schemes')
        },
        {
          id: 'report',
          label: t.exportPdfReport,
          desc: language === 'te' ? 'బ్యాంక్ రుణాలు & బీమా కోసం స్టేట్‌మెంట్' : language === 'hi' ? 'बैंक लोन एवं बीमा के लिए रिकॉर्ड' : 'Printable season summary for bank loans',
          icon: FileText,
          color: '#7c3aed',
          action: onOpenReportModal
        }
      ]
    },
    {
      title: 'Farmer Group & Settings',
      items: [
        {
          id: 'fpo',
          label: currentRole === 'farmer' ? 'FPO Coordinator View' : 'Farmer Dashboard',
          desc: language === 'te' ? 'సమూహ రైతులు & మార్కెట్ బల్క్ ప్రయోజనం' : language === 'hi' ? 'सामूहिक बिक्री एवं 148 किसानों का डाटा' : 'Cluster acreage, harvest & bulk bargaining',
          icon: Users,
          color: '#0f172a',
          action: onToggleRole
        },
        {
          id: 'profile',
          label: 'Farmer Profile & Switch Account',
          desc: language === 'te' ? 'భూమి వివరాలు & జిల్లా అమరికలు' : language === 'hi' ? 'खेत विवरण व जिला सेटिंग्स' : 'Manage land, district & test login accounts',
          icon: Settings,
          color: '#475569',
          action: onOpenLoginModal
        }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
          {language === 'te' ? 'అదనపు సేవలు & సెట్టింగులు' : language === 'hi' ? 'अतिरिक्त सुविधाएं व सेटिंग्स' : 'Additional Services & Tools'}
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Explore Phase 2 agritech tools, PDF generator, and community services
        </p>
      </div>

      {menuSections.map((sec, idx) => (
        <div key={idx} className="farm-card">
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            {sec.title}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Kisan Call Center Helpline Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>
            Toll-Free Agricultural Support
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}>
            Kisan Call Center: 1800-180-1551
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ecfdf5', opacity: 0.9 }}>
            Free advice in Telugu, Hindi & English (6 AM - 10 PM)
          </div>
        </div>

        <a
          href="tel:18001801551"
          style={{
            background: '#ffffff',
            color: '#064e3b',
            borderRadius: '10px',
            padding: '8px 12px',
            fontWeight: 800,
            fontSize: '0.78rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <PhoneCall size={14} /> Call
        </a>
      </div>
    </div>
  );
};
