# KisanSetu (రైతు సేతు / किसान सेतु)

> **Farmer-First Agritech Web Portal & Progressive Web App (PWA)**  
> Offline-capable platform for smallholder farmers (1 to 5 acres) providing live mandi market prices, real-time weather advisories, a 15-second farm expense diary, crop profit tracking, and an AI crop doctor.

---

## 🌾 Features Overview

- **🔴 Live Mandi Terminal & Ticker**: Continuous real-time APMC trading ticker across India with arrivals in tonnes, modal prices, and 7-day interactive SVG trend charts.
- **📍 Automatic All-India Geolocation**: Auto-detects GPS and network location across 70+ Indian agricultural districts with automatic distance recalculations.
- **🌦️ Real-Time Live Weather via Open-Meteo**: Hyperlocal temperature, humidity, precipitation probability, and agronomist rain spray advisories.
- **⚡ 15-Second Farm Diary & Expense Logger**: Fast custom on-screen numeric keypad (`+100`, `+500`, `+1000`, `+5000`), Web Speech API voice input, and 5-second undo toast.
- **🔐 Dedicated Login & Signup Screens**: Passwordless phone OTP sign-in, 4-digit security PIN, and a 3-step farmer onboarding wizard with land & crop selection.
- **💰 Season Profit & Loss Tracker**: Crop-wise profit ledger with expense distribution bars.
- **🖨️ Verified Season Audit Report**: One-click printable certificate formatted for bank credit (Kisan Credit Card) and PMFBY crop insurance claims.
- **🔬 Phase 2 AI Crop Doctor**: On-device leaf scanner with disease diagnosis and organic/chemical remedies.
- **🏛️ Government Scheme Finder**: Instant eligibility checker for PM-Kisan, Rythu Bharosa, and PM-KUSUM.
- **👥 FPO Coordinator Admin Portal**: Cluster dashboard for managing 148+ farmers with collective bargaining price advantages.
- **🌐 Trilingual Localization**: Complete support for **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
- **💾 Offline-First Architecture**: Powered by Dexie (IndexedDB) with client UUIDs and automatic sync.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 / 19, TypeScript, Vite
- **Styling**: Vanilla CSS Design Tokens (High-Contrast, Accessible 48px Touch Targets)
- **Icons**: Lucide React
- **Offline Storage**: Dexie.js (IndexedDB)
- **Live Weather API**: Open-Meteo free API
- **Live Location API**: BigDataCloud reverse geocoder & IP geolocation
- **Voice Recognition**: Web Speech API
- **Build Performance**: Gzipped production bundle **< 160 KB** (target < 200 KB)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Yarraakash/Farming-web.git
cd Farming-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The portal will be live at `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License
