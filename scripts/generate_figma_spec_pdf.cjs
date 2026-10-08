const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createFigmaSpecPdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette definitions
  const cForestDark = rgb(0.02, 0.18, 0.08);   // #052e16
  const cEmerald = rgb(0.02, 0.47, 0.34);      // #047857
  const cMint = rgb(0.06, 0.73, 0.51);         // #10b981
  const cGold = rgb(0.85, 0.47, 0.02);         // #d97706
  const cBlue = rgb(0.01, 0.52, 0.78);         // #0284c7
  const cRed = rgb(0.86, 0.15, 0.15);          // #dc2626
  const cDark = rgb(0.06, 0.09, 0.16);         // #0f172a
  const cMuted = rgb(0.39, 0.45, 0.55);        // #64748b
  const cLightBg = rgb(0.97, 0.98, 0.99);      // #f8fafc
  const cWhite = rgb(1, 1, 1);
  const cBorder = rgb(0.88, 0.91, 0.94);

  const PAGE_WIDTH = 595.28;  // A4
  const PAGE_HEIGHT = 841.89; // A4
  const MARGIN = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  let currentPage = null;
  let cursorY = 0;
  const pagesList = [];

  function addNewPage(headerTitle = 'KisanSetu - Figma UI Design & Prototype Specification') {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pagesList.push(currentPage);
    cursorY = PAGE_HEIGHT - MARGIN;

    // Running top banner
    currentPage.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 32,
      width: CONTENT_WIDTH,
      height: 18,
      color: cLightBg,
      borderColor: cBorder,
      borderWidth: 0.5
    });

    currentPage.drawText(headerTitle, {
      x: MARGIN + 8,
      y: PAGE_HEIGHT - 28,
      size: 8,
      font: fontBold,
      color: cEmerald
    });

    currentPage.drawText('OCTOBER 2026 - AGRITECH DESIGN SYSTEM', {
      x: PAGE_WIDTH - MARGIN - 180,
      y: PAGE_HEIGHT - 28,
      size: 7.5,
      font: fontRegular,
      color: cMuted
    });

    cursorY = PAGE_HEIGHT - 48;
    return currentPage;
  }

  function checkSpace(neededHeight, nextTitle) {
    if (cursorY - neededHeight < MARGIN + 25) {
      addNewPage(nextTitle);
    }
  }

  function drawHeading1(text) {
    checkSpace(35);
    cursorY -= 14;
    currentPage.drawText(text, {
      x: MARGIN,
      y: cursorY,
      size: 15,
      font: fontBold,
      color: cForestDark
    });
    cursorY -= 6;
    currentPage.drawLine({
      start: { x: MARGIN, y: cursorY },
      end: { x: MARGIN + CONTENT_WIDTH, y: cursorY },
      thickness: 1.5,
      color: cEmerald
    });
    cursorY -= 12;
  }

  function drawHeading2(text) {
    checkSpace(26);
    cursorY -= 10;
    currentPage.drawText(text, {
      x: MARGIN,
      y: cursorY,
      size: 12,
      font: fontBold,
      color: cEmerald
    });
    cursorY -= 12;
  }

  function drawParagraph(text, font = fontRegular, size = 9, color = cDark, indent = 0) {
    const words = text.split(' ');
    let line = '';
    const maxWidth = CONTENT_WIDTH - indent;

    for (const w of words) {
      const testLine = line + (line ? ' ' : '') + w;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth) {
        checkSpace(size + 4);
        currentPage.drawText(line, {
          x: MARGIN + indent,
          y: cursorY,
          size,
          font,
          color
        });
        cursorY -= size + 3;
        line = w;
      } else {
        line = testLine;
      }
    }
    if (line) {
      checkSpace(size + 4);
      currentPage.drawText(line, {
        x: MARGIN + indent,
        y: cursorY,
        size,
        font,
        color
      });
      cursorY -= size + 5;
    }
  }

  function drawCard(title, subtitle, items = [], badge = null) {
    const cardHeight = 28 + (subtitle ? 14 : 0) + items.length * 13 + 12;
    checkSpace(cardHeight);

    currentPage.drawRectangle({
      x: MARGIN,
      y: cursorY - cardHeight + 8,
      width: CONTENT_WIDTH,
      height: cardHeight,
      color: cLightBg,
      borderColor: cBorder,
      borderWidth: 1
    });

    let innerY = cursorY - 6;

    currentPage.drawText(title, {
      x: MARGIN + 12,
      y: innerY,
      size: 10,
      font: fontBold,
      color: cForestDark
    });

    if (badge) {
      const badgeW = fontBold.widthOfTextAtSize(badge, 7.5) + 12;
      currentPage.drawRectangle({
        x: MARGIN + CONTENT_WIDTH - badgeW - 12,
        y: innerY - 2,
        width: badgeW,
        height: 13,
        color: cEmerald
      });
      currentPage.drawText(badge, {
        x: MARGIN + CONTENT_WIDTH - badgeW - 6,
        y: innerY + 1.5,
        size: 7.5,
        font: fontBold,
        color: cWhite
      });
    }

    innerY -= 14;

    if (subtitle) {
      currentPage.drawText(subtitle, {
        x: MARGIN + 12,
        y: innerY,
        size: 8,
        font: fontOblique,
        color: cMuted
      });
      innerY -= 13;
    }

    for (const itm of items) {
      currentPage.drawText(`-  ${itm}`, {
        x: MARGIN + 16,
        y: innerY,
        size: 8,
        font: fontRegular,
        color: cDark
      });
      innerY -= 12;
    }

    cursorY -= cardHeight + 6;
  }

  // ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ====================
  addNewPage('KisanSetu - Complete Figma UI Design & Prototyping Specification');

  // Hero banner background
  currentPage.drawRectangle({
    x: MARGIN,
    y: cursorY - 140,
    width: CONTENT_WIDTH,
    height: 140,
    color: cForestDark
  });

  currentPage.drawText('KISANSETU (Raitu Setu / Kisan Setu)', {
    x: MARGIN + 18,
    y: cursorY - 32,
    size: 20,
    font: fontBold,
    color: cWhite
  });

  currentPage.drawText('Comprehensive Figma UI/UX Design System & Interactive Prototype Specification', {
    x: MARGIN + 18,
    y: cursorY - 54,
    size: 11,
    font: fontBold,
    color: cMint
  });

  currentPage.drawText('Target Platform: Responsive Widescreen Web Portal (1440x900) & Mobile Android PWA (390x844)', {
    x: MARGIN + 18,
    y: cursorY - 76,
    size: 8.5,
    font: fontRegular,
    color: cWhite
  });

  currentPage.drawText('Document Version: 2.4.0 - October 2026 - Prepared for Figma Wireframing & Dev Hand-off', {
    x: MARGIN + 18,
    y: cursorY - 96,
    size: 8,
    font: fontOblique,
    color: rgb(0.8, 0.9, 0.85)
  });

  cursorY -= 160;

  drawHeading1('1. Executive Product & UX Overview');
  drawParagraph(
    'KisanSetu is a high-performance, farmer-first agritech portal and Progressive Web App designed specifically for small and marginal landholders (1 to 5 acres). The user interface prioritizes clarity, extreme contrast for outdoor sunlight legibility, icon-driven affordances, tactile 48px touch targets, full offline reliability via IndexedDB, and trilingual support across English, Telugu (Telugu), and Hindi (Hindi).'
  );
  drawParagraph(
    'This document provides the exact Figma design tokens, auto-layout frame measurements, typography styles, atomic components, screen-by-screen architectural blueprints, and interactive prototype flow transition settings required to build and maintain the Figma UI design file.'
  );

  drawHeading2('Core UX Metrics & Principles for Figma Prototype');
  drawCard('Three-Tap Core Rule', 'Any essential farming action must take <= 3 user taps from the primary home screen.', [
    'Tap 1: Access Dashboard -> Tap 2: Tap Commodity / Market -> Tap 3: View 7-Day Trend Chart & Set Alert.',
    'Tap 1: Tap "+ Quick Log" -> Tap 2: Tap "+500" & "Labor" -> Tap 3: Tap "Save" (Completed in < 15 seconds).',
    'Minimum 48px hit areas on all buttons, keypad digits, and category chips for rough-finger accessibility.'
  ], 'HIGH CONTRAST');

  drawCard('Dual Viewport Responsive Frame Strategy', 'Figma components should be structured using Auto-Layout for seamless scaling.', [
    'Primary Desktop Web Frame: 1440px x 900px (12-column grid, 80px margins, 24px gutters).',
    'Mobile Android PWA Frame: 390px x 844px (4-column grid, 16px margins, 12px gutters).',
    'Responsive Breakpoints: Mobile (<= 640px), Tablet (641px - 1024px), Desktop Widescreen (>= 1025px).'
  ], 'AUTO-LAYOUT');

  // ==================== PAGE 2: DESIGN TOKENS & SYSTEM ====================
  addNewPage('KisanSetu - Figma Design Tokens & Color Palette');

  drawHeading1('2. Figma Design System Tokens (Color, Type & Spacing)');
  drawParagraph('Import the following color styles, text styles, and effect styles directly into your Figma local library.');

  drawHeading2('A. Color Palette & Semantic Roles');
  drawCard('Primary Emerald & Forest Greens (Brand & Farming Foundation)', 'Represents growth, stability and verified government alignment.', [
    'primary-950: #021A0D (Deepest background tint & header gradients)',
    'primary-900: #052E16 (Main dark brand surfaces, title banners)',
    'primary-800: #064E3B (Primary buttons, active tab highlights, strong borders)',
    'primary-700: #047857 (Call-to-action buttons, high-emphasis status icons)',
    'primary-500: #10B981 (Live ticker badges, price increase arrows, success checkmarks)',
    'primary-50:  #ECFDF5 (Light tinted card backgrounds, active selection chips)'
  ], 'PRIMARY');

  drawCard('Functional Accent & Alert Colors', 'Carefully selected for high visual pop without overwhelming low-literacy users.', [
    'accent-amber: #D97706 / #F59E0B (Price alerts, task warnings, OTP banners, gold badges)',
    'rain-blue:    #0284C7 / #0369A1 (Hyperlocal rain alerts, GPS indicators, irrigation cues)',
    'danger-red:   #DC2626 / #FEE2E2 (Price drops, critical pest severity, offline sync deficit)',
    'surface-bg:   #F8FAFC / #F1F5F9 (Clean neutral app background for low eye fatigue)',
    'text-main:    #0F172A (90% black for sharp outdoor sunlight readability)',
    'text-muted:   #64748B (Secondary labels, metric units, distances)'
  ], 'ACCENTS');

  drawHeading2('B. Typography Hierarchy (Figma Text Styles)');
  drawParagraph('Headers utilize "Outfit" for friendly modern legibility. Body and numerical data utilize "Plus Jakarta Sans" with tabular numbers enabled for price comparisons.');
  drawCard('Typography Scale Table', 'Set in Figma as standardized Text Styles:', [
    'Display Hero: Outfit Bold 800 - 32px / 40px line-height - -0.5px letter spacing (Banners)',
    'Heading 1:    Outfit ExtraBold 800 - 24px / 32px - -0.3px spacing (Section Titles, Modals)',
    'Heading 2:    Outfit Bold 700 - 18px / 26px - -0.2px spacing (Card Titles, Modal Rates)',
    'Heading 3:    Outfit SemiBold 600 - 15px / 22px - Normal spacing (Category groups)',
    'Body Regular: Plus Jakarta Sans 400 - 14px / 20px (General descriptions & advisory notes)',
    'Body Bold:    Plus Jakarta Sans 700 - 14px / 20px (Button labels, key metrics, table rows)',
    'Caption/Pill: Plus Jakarta Sans 800 - 12px / 16px (Badges, trend deltas, distance indicators)',
    'Keypad Num:   Outfit ExtraBold 800 - 24px / 28px (Numeric keypad inputs)'
  ], 'TYPOGRAPHY');

  // ==================== PAGE 3: COMPONENT SPECIFICATIONS ====================
  addNewPage('KisanSetu - Atomic Components & Figma UI Kits');

  drawHeading1('3. Core UI Components & Atomic Design Specifications');

  drawHeading2('A. Interactive Buttons & Touch Targets (48px+ Rule)');
  drawCard('Button Specifications (Figma Auto-Layout)', 'All clickable items adhere to minimum 48px height:', [
    'Primary CTA: Height 52px, Radius 14px, Padding: [14px 20px], Background: Linear Gradient (#047857 -> #059669), Text: White 15px Bold, Shadow: 0 4px 14px rgba(4,120,87,0.35).',
    'Secondary Button: Height 48px, Radius 12px, Padding: [12px 18px], Border: 1.5px solid #A7F3D0, Background: White / #ECFDF5, Text: #064E3B 14px Bold.',
    'Quick Keypad Cell: Height 50px, Radius 12px, Background: #F1F5F9, Border: 1px solid #CBD5E1, Text: #0F172A 20px Bold. Preset Increment (+100, +500): Background #FEF3C7, Text #B45309.',
    'Crop / Filter Chip: Height 38px, Radius 10px, Padding: [8px 14px], Icon: 16px, Border: 1.5px solid #CBD5E1. Active state: Background #047857, Border #047857, Text White.'
  ], 'BUTTONS');

  drawHeading2('B. Status Indicators, Badges & Alert Banners');
  drawCard('Information Banners & Real-Time Indicators', 'Ensures honest and transparent app states:', [
    'Live Mandi Ticker: Height 34px, Full Width, Background: #022C22, Text: White 12px SemiBold. Continuous horizontal marquee animation with green (+Rs. ) and red (-Rs. ) badges.',
    'Weather Rain Alert: Radius 16px, Background: Linear Gradient (#0369A1 -> #0284C7), Icon: 26px CloudRain in White pill, Title: 16px Bold with AlertTriangle in Gold, Text: 13px White.',
    'Offline Sync Badge: 3 States -> [Saved: #ECFDF5 text #047857] | [Offline: #FEF3C7 text #B45309 with pulsing dot] | [Syncing: #DBEAFE text #1E40AF with rotating spinner].'
  ], 'INDICATORS');

  // ==================== PAGE 4: SCREEN-BY-SCREEN SPECIFICATIONS ====================
  addNewPage('KisanSetu - Screen Architecture & Figma Frames');

  drawHeading1('4. Screen-by-Screen Layout Specifications (10 Figma Frames)');

  drawCard('Frame 01: Welcome, Sign In & Security PIN Screen', 'Dimensions: 1440x900 (Desktop) & 390x844 (Mobile)', [
    'Left Split Hero: 480px width, Background #052E16, Platform highlights with Lucide icons (TrendingUp, CloudSun, ShieldCheck), Trust badges ("Free for smallholder farmers").',
    'Right Auth Card: Tab switcher (Sign In vs Create Account), Role toggle (Farmer vs FPO Coordinator), 10-digit mobile number input with +91, 4-digit OTP box (pre-filled 4821 for evaluation).',
    'Instant 1-Click Demo Profiles: "Farmer Ravi (3 Acres)" & "FPO Suresh Babu" buttons for instant test access.',
    'Language selector pill anchored to top right header (English, Telugu, Hindi).'
  ], 'FRAME 01');

  drawCard('Frame 02: 3-Step Farmer Onboarding Wizard', 'Dimensions: 390x844 & Modal 580x640', [
    'Step Indicator: 3 segmented progress bars at top in #047857.',
    'Step 1 (Mobile & PIN): Phone input, 4-digit security PIN setup, OTP verification.',
    'Step 2 (Farmer & Location): Full Name, State dropdown, District input (Warangal), Village/Panchayat (Atmakur).',
    'Step 3 (Cultivation Profile): Acreage input (1-50 Acres), Soil type select (Red Sandy Loam), Selectable crop chips (Paddy, Groundnut, Cotton, Chilli, Tomato, Maize, Soybean, Turmeric).',
    'Success State: Celebratory micro-confetti burst with redirect to Dashboard.'
  ], 'FRAME 02');

  drawCard('Frame 03: Live Widescreen Dashboard', 'Dimensions: 1440x900 (3-Column Desktop Grid: 360px | Flex 1 | 340px)', [
    'Top Welcome Banner: Farmer name, village, landholding, + Quick Log (15s) and Log Field Work buttons.',
    'Rain Alert Banner: Displayed conditionally when rain probability > 50% with sprayer postponement advisory.',
    'Column 1: Real-time Open-Meteo weather radar card, temperature, humidity, wind, 5-day forecast strip, and Active Crops inventory.',
    'Column 2: Live Mandi snapshot cards with modal prices, arrival volumes, day trends, and Due Farm Tasks with checkable items.',
    'Column 3: Season Net Profit banner card (Rs. 56,300), AI Crop Doctor quick launch widget, and Govt Subsidy eligibility badges.'
  ], 'FRAME 03');

  // ==================== PAGE 5: ADVANCED SCREENS SPECIFICATIONS ====================
  addNewPage('KisanSetu - Mandi Terminal & Rapid Entry Specifications');

  drawHeading1('5. Advanced Screens & Modal Layouts');

  drawCard('Frame 04: Rapid 15-Second Farm Diary & Keypad Modal', 'Dimensions: Mobile Bottom Sheet (390x620) & Desktop Modal (520x680)', [
    'Header: "Quick Farm Entry" with close icon and subtitle "Record in under 15 seconds - Works offline".',
    'Mode Switch: Toggle between "Log Expense" and "Log Field Work".',
    'Crop Selector: Horizontal scrollable chips for active crops (Paddy, Groundnut).',
    'Category Grid: 3x2 grid with Lucide icons (Labor, Fertilizer, Seeds, Machinery, Pesticides, Harvest Sale).',
    'Amount Display: Big 28px bold numerals with currency symbol Rs.  and Web Speech voice dictation button.',
    'Custom Numeric Keypad: 4x4 grid: [1,2,3, +100] [4,5,6, +500] [7,8,9, +1000] [Clear, 0, Backspace, +5000].',
    'Save CTA: Full-width green button with Check icon -> triggers 5-second Undo toast upon saving.'
  ], 'FRAME 04');

  drawCard('Frame 05: Live Mandi Trading Terminal & 7-Day Trend', 'Dimensions: 1440x900 & Mobile Scroll', [
    'Header: Live Trading Terminal title with red "LIVE APMC" pulsing pill, "Fetch Live Quotes" refresh button, "Set Alert" button.',
    'Search & Filter Bar: Instant search input by market/commodity, State filter pills, Commodity filter chips.',
    'Active Market 7-Day Trend Hero Card: Selected mandi details, grade, arrivals in tonnes, demand level, and interactive SVG line chart with date points, grid lines, and highs/lows.',
    'Mandi Depth Cards Grid: Min, Max, Modal prices, distance in km from detected GPS location, arrival volume, and day trend delta.',
    'Set Price Alert Modal: Target price input with confirmation toast.'
  ], 'FRAME 05');

  drawCard('Frame 06: All-India Location Explorer Modal', 'Dimensions: 680x600 Center Modal', [
    'Active Location Card: Shows currently active district with coordinates and "Auto-Detect GPS" button.',
    'Search Input: Instant typeahead searching across 70+ Indian agricultural districts and APMC hubs.',
    'State Filter Tabs: Telangana, Andhra Pradesh, Maharashtra, MP, Punjab, Gujarat, Rajasthan, Karnataka, etc.',
    'Results Grid: Clickable district cards with state badges that recalculate weather and mandi distances upon selection.'
  ], 'FRAME 06');

  // ==================== PAGE 6: PROTOTYPE INTERACTIONS & FIGMA FLOWS ====================
  addNewPage('KisanSetu - Figma Interactive Prototyping Flow Maps');

  drawHeading1('6. Figma Interactive Prototyping Flow Architecture');
  drawParagraph('Connect your Figma frames using the exact prototype interaction triggers and animation settings below:');

  drawCard('Flow 1: First-Run Onboarding & Authentication Flow', 'Prototype Connections:', [
    'Trigger: On Click "Create Account" -> Action: Open Frame 02 (Step 1) -> Transition: Smart Animate, Ease Out, 250ms.',
    'Trigger: On Click "Continue to Farmer Details" -> Action: Navigate to Frame 02 (Step 2) -> Transition: Slide In Right, 200ms.',
    'Trigger: On Click "Next: Land & Crops" -> Action: Navigate to Frame 02 (Step 3) -> Transition: Slide In Right, 200ms.',
    'Trigger: On Click "Complete Registration" -> Action: Navigate to Frame 03 (Dashboard) -> Transition: Dissolve, 300ms + trigger Confetti.'
  ], 'FLOW 01');

  drawCard('Flow 2: Rapid 15-Second Expense Entry Flow', 'Prototype Connections:', [
    'Trigger: On Click "+ Quick Log (15s)" on Dashboard -> Action: Open Overlay (Frame 04) -> Position: Bottom Center, Animation: Move In (Bottom), Gentle 300ms.',
    'Trigger: On Click Keypad numbers / "+500" -> Action: Set Variable (Amount = Amount + 500), State: Tactile scale 0.96 active.',
    'Trigger: On Click "Save Entry" -> Action: Close Overlay -> Action 2: Show Component (Toast Notification: "Saved to local diary! Undo") for 5000ms delay.'
  ], 'FLOW 02');

  drawCard('Flow 3: Mandi Price Inspection & Price Alert Flow', 'Prototype Connections:', [
    'Trigger: On Click "Mandi Prices" Tab in top nav -> Action: Navigate to Frame 05 (Terminal) -> Transition: Instant.',
    'Trigger: On Click any Mandi card (e.g. Warangal Paddy) -> Action: Change Variant (Hero Trend Chart swaps active dataset).',
    'Trigger: On Click "Set Alert" -> Action: Open Overlay (Target Price Modal) -> Action: On Confirm -> Show notification badge.'
  ], 'FLOW 03');

  drawCard('Flow 4: AI Crop Doctor Diagnosis Flow', 'Prototype Connections:', [
    'Trigger: On Click "Crop Doctor (AI)" Tab -> Action: Navigate to Frame 09 -> Transition: Dissolve 200ms.',
    'Trigger: On Click "Leaf Sample (Rice Blast)" -> Action: Set Variant (Active Sample Image).',
    'Trigger: On Click "Run AI Diagnosis" -> Action: Play Laser Beam Animation (1200ms delay) -> Action 2: Reveal Diagnosis Report Card with 96% Confidence score, Organic Remedy and Chemical Treatment.'
  ], 'FLOW 04');

  // ==================== PAGE 7: FIGMA AUTO-LAYOUT & HANDOFF CHECKLIST ====================
  addNewPage('KisanSetu - Figma Auto-Layout & Developer Handoff Checklist');

  drawHeading1('7. Figma Auto-Layout Rules & Developer Handoff');

  drawCard('Auto-Layout Structure Rules for Figma Components', 'Follow these constraints for 1:1 code parity:', [
    'Top Ticker: Auto-Layout Horizontal, Spacing: 28px, Padding: [7px 16px], Fixed Height: 34px, Fill: #022C22, Clip Content: Checked.',
    'Portal Header: Auto-Layout Horizontal, Space Between, Padding: [12px 24px], Fill: Linear Gradient, Width: Fill Container.',
    'Dashboard 3-Column Grid: Parent Auto-Layout Horizontal, Gap: 20px, Child 1: Fixed 360px, Child 2: Fill Container, Child 3: Fixed 340px.',
    'Keypad Grid: Auto-Layout Vertical, Gap: 8px. Rows: Auto-Layout Horizontal, Gap: 8px, Children: Fill Container (equal width).'
  ], 'AUTO-LAYOUT');

  drawCard('Usability Testing Checklist for Pilot Evaluation', 'Tasks for farmer user testing sessions:', [
    'Task 1: Log an expense of Rs. 600 for weed removal labor in under 15 seconds without assistance.',
    'Task 2: Identify today\'s modal price for Paddy in Warangal APMC and compare it with Khammam yard.',
    'Task 3: Locate today\'s rainfall warning and read the agronomist spray advisory.',
    'Task 4: Switch app language to Telugu (Telugu) and verify crop names (Paddy (Vari), Groundnut (Verusenaga), Cotton (Patti)).'
  ], 'USABILITY TEST');

  // ==================== NUMBER ALL PAGES AT THE BOTTOM ====================
  const totalPages = pagesList.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pagesList[i];
    p.drawText(`Page ${i + 1} of ${totalPages}`, {
      x: PAGE_WIDTH / 2 - 20,
      y: 20,
      size: 8,
      font: fontRegular,
      color: cMuted
    });
    p.drawText('KisanSetu Agritech - Confidential - For Internal Figma Design & Engineering Use', {
      x: MARGIN,
      y: 20,
      size: 7,
      font: fontOblique,
      color: cMuted
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'KisanSetu_Figma_UI_Design_and_Prototype_Spec.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF successfully created at:', outputPath, 'Total Pages:', totalPages);
}

createFigmaSpecPdf().catch(err => {
  console.error('PDF generation error:', err);
  process.exit(1);
});
