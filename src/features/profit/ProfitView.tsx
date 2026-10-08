import React, { useState } from 'react';
import {
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  PlusCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import {
  Language,
  Transaction,
  FarmCrop,
  TransactionCategory
} from '../../types';
import { translations } from '../../lib/i18n';

interface ProfitViewProps {
  transactions: Transaction[];
  crops: FarmCrop[];
  language: Language;
  onOpenQuickLog: (tab?: 'expense' | 'activity') => void;
  onOpenReportModal: () => void;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const ProfitView: React.FC<ProfitViewProps> = ({
  transactions,
  crops,
  language,
  onOpenQuickLog,
  onOpenReportModal,
  onDeleteTransaction
}) => {
  const t = translations[language];

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif');

  const filteredTx = transactions.filter((tx) => {
    if (selectedCropFilter !== 'all' && tx.crop_id !== selectedCropFilter) {
      return false;
    }
    return true;
  });

  const totalIncome = filteredTx
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTx
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const isProfitable = netProfit >= 0;

  // Breakdown by category
  const expenseByCategory: Record<TransactionCategory, number> = {
    labor: 0,
    fertilizer: 0,
    seeds: 0,
    machinery: 0,
    pesticides: 0,
    transport: 0,
    harvest_sale: 0,
    other: 0
  };

  filteredTx
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const categoryLabels: Record<TransactionCategory, string> = {
    labor: t.catLabor,
    fertilizer: t.catFertilizer,
    seeds: t.catSeeds,
    machinery: t.catMachinery,
    pesticides: t.catPesticides,
    transport: t.catTransport,
    harvest_sale: t.catHarvestSale,
    other: t.catOther
  };

  const categoryColors: Record<TransactionCategory, string> = {
    labor: '#059669',
    fertilizer: '#d97706',
    seeds: '#0284c7',
    machinery: '#7c3aed',
    pesticides: '#e11d48',
    transport: '#ea580c',
    harvest_sale: '#16a34a',
    other: '#64748b'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title & Export PDF button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
            {t.navProfit}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {t.seasonSummary}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          style={{
            minHeight: '40px',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1.5px solid #047857',
            background: '#ffffff',
            color: '#047857',
            fontWeight: 700,
            fontSize: '0.76rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <FileText size={15} />
          <span>{language === 'te' ? 'రిపోర్ట్ PDF' : language === 'hi' ? 'रिपोर्ट PDF' : 'PDF Report'}</span>
        </button>
      </div>

      {/* Filter by Crop pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
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

      {/* Net Profit Big Banner Card */}
      <div
        className="farm-card elevated"
        style={{
          background: isProfitable
            ? 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
            : 'linear-gradient(135deg, #78350f 0%, #991b1b 100%)',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 600 }}>
              {t.netProfit} ({selectedSeason} Season)
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {isProfitable ? '+' : ''}₹{netProfit.toLocaleString('en-IN')}
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: '99px',
              background: 'rgba(255, 255, 255, 0.18)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isProfitable ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{isProfitable ? 'Net Gain' : 'Deficit'}</span>
          </div>
        </div>

        {/* Income vs Expenses breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#d1fae5' }}>{t.totalIncome}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 800 }}>
              ₹{totalIncome.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#fed7aa' }}>{t.totalExpenses}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 800 }}>
              ₹{totalExpenses.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Category Breakdown Chart */}
      <div className="farm-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          {language === 'te' ? 'ఖర్చుల విభజన' : language === 'hi' ? 'खर्च का वर्गीकरण' : 'Expense Breakdown'}
        </h3>

        {totalExpenses === 0 ? (
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
            No expenses recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(expenseByCategory)
              .filter(([_, amt]) => amt > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => {
                const pct = Math.round((amt / totalExpenses) * 100);
                const color = categoryColors[cat as TransactionCategory] || '#64748b';
                const label = categoryLabels[cat as TransactionCategory] || cat;

                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '3px' }}>
                      <span style={{ color: '#334155' }}>{label}</span>
                      <span style={{ color: '#0f172a' }}>
                        ₹{amt.toLocaleString('en-IN')}{' '}
                        <span style={{ color: '#64748b', fontWeight: 500 }}>({pct}%)</span>
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: color,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Transaction History Entries */}
      <div className="farm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>
            {language === 'te' ? 'ఇటీవలి లావాదేవీలు' : language === 'hi' ? 'हाल के लेनदेन' : 'Recent Transactions'}
          </h3>
          <button
            onClick={() => onOpenQuickLog('expense')}
            style={{
              background: 'none',
              border: 'none',
              color: '#047857',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + {t.logExpense}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTx.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: tx.type === 'income' ? '#047857' : '#0f172a'
                    }}
                  >
                    {categoryLabels[tx.category] || tx.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: tx.synced ? '#d1fae5' : '#fef3c7',
                      color: tx.synced ? '#047857' : '#92400e'
                    }}
                  >
                    {tx.synced ? 'Saved' : 'Offline'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                  {tx.crop_name.split('/')[0]} • {tx.date} {tx.note ? `• ${tx.note}` : ''}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: tx.type === 'income' ? '#047857' : '#b91c1c'
                  }}
                >
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
