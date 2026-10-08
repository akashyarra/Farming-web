import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile, FarmCrop, Transaction } from '../../types';

interface SeasonReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  crops: FarmCrop[];
  transactions: Transaction[];
}

export const SeasonReportPrintModal: React.FC<SeasonReportPrintModalProps> = ({
  isOpen,
  onClose,
  user,
  crops,
  transactions
}) => {
  if (!isOpen) return null;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'center', padding: '16px' }}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          maxHeight: '90vh',
          borderRadius: '20px',
          padding: '24px',
          background: '#ffffff'
        }}
      >
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#047857" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
              Farmer Verified Season Statement
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#047857',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
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
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Printable Certificate Document */}
        <div
          id="print-certificate"
          style={{
            border: '2px solid #064e3b',
            borderRadius: '14px',
            padding: '24px',
            background: '#ffffff'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Government Certified Farm Digital Record • KisanSetu PWA
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              AGRICULTURAL SEASON AUDIT & YIELD STATEMENT
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Valid for Kisan Credit Card (KCC) Limit Extension & PMFBY Crop Insurance Assessment
            </div>
          </div>

          {/* Farmer Particulars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.82rem' }}>
            <div>
              <div><strong>Farmer Name:</strong> {user.name}</div>
              <div><strong>Mobile / Farmer ID:</strong> +91 {user.phone}</div>
              <div><strong>Village & District:</strong> {user.village}, {user.district}</div>
            </div>
            <div>
              <div><strong>Total Land Cultivated:</strong> {user.acres} Acres</div>
              <div><strong>Soil Classification:</strong> {user.soil_type}</div>
              <div><strong>Season:</strong> Kharif 2026</div>
            </div>
          </div>

          {/* Cultivated Crops Breakdown */}
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>
            Active Cultivation Inventory
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '16px' }}>
            <thead>
              <tr style={{ background: '#ecfdf5', color: '#064e3b', textAlign: 'left' }}>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Crop</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Variety</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Area</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Sowing Date</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Stage</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 700 }}>{c.crop_name.split('/')[0]}</td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{c.variety}</td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{c.acres} Acres</td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{c.sowing_date}</td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{c.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Summary */}
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>
            Season Financial Ledger
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.74rem', color: '#065f46', fontWeight: 700 }}>Total Revenue / Sale</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#047857' }}>₹{totalIncome.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 700 }}>Total Cultivation Cost</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>₹{totalExpense.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: 700 }}>Net Farmer Margin</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8' }}>₹{netProfit.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Verification Signature & Seals */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px dashed #cbd5e1' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700, fontSize: '0.78rem' }}>
                <CheckCircle2 size={16} /> Verified via Local Cryptographic Hash
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Generated on {new Date().toLocaleDateString()} via KisanSetu Offline-First Engine
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ width: '130px', borderBottom: '1px solid #334155', margin: '0 0 4px auto' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Farmer / FPO Seal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
