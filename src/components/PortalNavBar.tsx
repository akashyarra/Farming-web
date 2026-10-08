import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  PieChart,
  CalendarDays,
  Activity,
  Landmark,
  Users
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../lib/i18n';

export type PortalTab =
  | 'dashboard'
  | 'mandi'
  | 'diary'
  | 'profit'
  | 'calendar'
  | 'cropdoctor'
  | 'schemes'
  | 'fpo';

interface PortalNavBarProps {
  currentTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  language: Language;
  currentRole: UserRole;
}

export const PortalNavBar: React.FC<PortalNavBarProps> = ({
  currentTab,
  onTabChange,
  language,
  currentRole
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'dashboard' as PortalTab,
      label: language === 'te' ? 'డాష్‌బోర్డ్' : language === 'hi' ? 'डैशबोर्ड' : 'Live Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'mandi' as PortalTab,
      label: t.navPrices,
      icon: TrendingUp
    },
    {
      id: 'diary' as PortalTab,
      label: t.navDiary,
      icon: BookOpen
    },
    {
      id: 'profit' as PortalTab,
      label: t.navProfit,
      icon: PieChart
    },
    {
      id: 'calendar' as PortalTab,
      label: t.navCalendar,
      icon: CalendarDays
    },
    {
      id: 'cropdoctor' as PortalTab,
      label: `${t.navCropDoctor} (AI)`,
      icon: Activity
    },
    {
      id: 'schemes' as PortalTab,
      label: t.navSchemes,
      icon: Landmark
    },
    {
      id: 'fpo' as PortalTab,
      label: currentRole === 'farmer' ? 'FPO Cluster' : 'FPO Admin View',
      icon: Users
    }
  ];

  return (
    <nav className="portal-nav-bar">
      <div className="nav-bar-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`portal-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
