import React from 'react';
import {
  Home,
  TrendingUp,
  BookOpen,
  PieChart,
  LayoutGrid
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

export type NavTab = 'home' | 'prices' | 'diary' | 'profit' | 'more' | 'calendar' | 'cropdoctor' | 'schemes' | 'fpo';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  language
}) => {
  const t = translations[language];

  // If sub-features are selected, highlight the relevant parent tab
  const isMoreActive = ['more', 'calendar', 'cropdoctor', 'schemes'].includes(currentTab);

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab-btn ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
        aria-label="Home"
      >
        <Home size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
        <span>{t.navHome}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === 'prices' ? 'active' : ''}`}
        onClick={() => onTabChange('prices')}
        aria-label="Mandi Prices"
      >
        <TrendingUp size={22} strokeWidth={currentTab === 'prices' ? 2.5 : 2} />
        <span>{t.navPrices}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === 'diary' ? 'active' : ''}`}
        onClick={() => onTabChange('diary')}
        aria-label="Farm Diary"
      >
        <BookOpen size={22} strokeWidth={currentTab === 'diary' ? 2.5 : 2} />
        <span>{t.navDiary}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === 'profit' ? 'active' : ''}`}
        onClick={() => onTabChange('profit')}
        aria-label="Profit and Costs"
      >
        <PieChart size={22} strokeWidth={currentTab === 'profit' ? 2.5 : 2} />
        <span>{t.navProfit}</span>
      </button>

      <button
        className={`nav-tab-btn ${isMoreActive ? 'active' : ''}`}
        onClick={() => onTabChange('more')}
        aria-label="More Features"
      >
        <LayoutGrid size={22} strokeWidth={isMoreActive ? 2.5 : 2} />
        <span>{language === 'te' ? 'ఇతర' : language === 'hi' ? 'अन्य' : 'More'}</span>
      </button>
    </nav>
  );
};
