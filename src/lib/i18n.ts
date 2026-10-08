import { Language } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  // Navigation
  navHome: string;
  navPrices: string;
  navDiary: string;
  navProfit: string;
  navCalendar: string;
  navCropDoctor: string;
  navSchemes: string;
  navFpo: string;
  // Sync
  statusOnline: string;
  statusOffline: string;
  statusSyncing: string;
  statusAllSaved: string;
  unsyncedEntries: string;
  syncNow: string;
  lastUpdated: string;
  // Weather
  weatherToday: string;
  rainAlert: string;
  rainAlertSubtitle: string;
  humidity: string;
  wind: string;
  rainChance: string;
  advisoryTitle: string;
  // Mandi
  mandiTitle: string;
  mandiSubtitle: string;
  modalPrice: string;
  minMaxPrice: string;
  targetPriceAlert: string;
  setAlert: string;
  alertSetSuccess: string;
  sevenDayTrend: string;
  filterAll: string;
  distance: string;
  perQuintal: string;
  // Diary & Expenses
  quickLogBtn: string;
  quickLogTitle: string;
  logActivity: string;
  logExpense: string;
  logIncome: string;
  amountLabel: string;
  selectCrop: string;
  selectCategory: string;
  voiceDictate: string;
  listening: string;
  saveEntry: string;
  saving: string;
  savedSuccessfully: string;
  undo: string;
  quickKeypad: string;
  clear: string;
  // Categories
  catSeeds: string;
  catFertilizer: string;
  catLabor: string;
  catMachinery: string;
  catPesticides: string;
  catTransport: string;
  catHarvestSale: string;
  catOther: string;
  // Activities
  actSowing: string;
  actIrrigation: string;
  actSpraying: string;
  actFertilizer: string;
  actWeeding: string;
  actHarvest: string;
  // Profit & Season
  totalIncome: string;
  totalExpenses: string;
  netProfit: string;
  seasonSummary: string;
  exportPdfReport: string;
  cropWiseProfit: string;
  // Crop Calendar
  daysPassed: string;
  currentStage: string;
  tasksDue: string;
  markDone: string;
  taskCompleted: string;
  // Crop Doctor
  cropDoctorTitle: string;
  cropDoctorSubtitle: string;
  uploadLeafPhoto: string;
  scanNow: string;
  diagnosing: string;
  organicRemedy: string;
  chemicalRemedy: string;
  // Schemes
  govSchemesTitle: string;
  checkEligibility: string;
  eligibleBadge: string;
  // Onboarding & Profile
  welcomeTitle: string;
  phoneLabel: string;
  enterOtp: string;
  verifyLogin: string;
  demoLoginFarmer: string;
  demoLoginFpo: string;
  selectLanguage: string;
  acresLabel: string;
  villageLabel: string;
  soilLabel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KisanSetu",
    appTagline: "Farmer-First Progressive Web App",
    navHome: "Home",
    navPrices: "Mandi Prices",
    navDiary: "Farm Diary",
    navProfit: "Profit & Costs",
    navCalendar: "Calendar",
    navCropDoctor: "Crop Doctor",
    navSchemes: "Schemes",
    navFpo: "FPO Admin",
    statusOnline: "Online",
    statusOffline: "Offline Mode",
    statusSyncing: "Syncing...",
    statusAllSaved: "All saved",
    unsyncedEntries: "pending sync",
    syncNow: "Sync Now",
    lastUpdated: "Updated just now",
    weatherToday: "Today's Weather",
    rainAlert: "Rain Alert",
    rainAlertSubtitle: "Heavy rain expected in 24-48 hrs. Postpone chemical spray & ensure field drainage.",
    humidity: "Humidity",
    wind: "Wind",
    rainChance: "Rain",
    advisoryTitle: "Farmer Advisory",
    mandiTitle: "Live Mandi Prices",
    mandiSubtitle: "Today's modal rates from nearby agricultural market yards",
    modalPrice: "Modal Rate",
    minMaxPrice: "Min - Max",
    targetPriceAlert: "Price Alert",
    setAlert: "Set Price Alert",
    alertSetSuccess: "Alert created successfully! You will be notified when target price is hit.",
    sevenDayTrend: "7-Day Price Trend",
    filterAll: "All Crops",
    distance: "away",
    perQuintal: "/ quintal (100 kg)",
    quickLogBtn: "+ Quick Log (15s)",
    quickLogTitle: "Quick Farm Entry",
    logActivity: "Log Field Work",
    logExpense: "Log Expense",
    logIncome: "Log Harvest Sale",
    amountLabel: "Amount (₹)",
    selectCrop: "Select Crop",
    selectCategory: "Expense Category",
    voiceDictate: "Voice Input (Tap to speak)",
    listening: "Listening... Say amount like '500 rupees for labor'",
    saveEntry: "Save (Works Offline)",
    saving: "Saving...",
    savedSuccessfully: "Saved to local diary!",
    undo: "Undo",
    quickKeypad: "Quick Keypad",
    clear: "Clear",
    catSeeds: "Seeds",
    catFertilizer: "Fertilizer",
    catLabor: "Labor / Coolie",
    catMachinery: "Tractor / Machinery",
    catPesticides: "Pesticides",
    catTransport: "Transport",
    catHarvestSale: "Harvest Sale (Income)",
    catOther: "Other Cost",
    actSowing: "Sowing",
    actIrrigation: "Irrigation",
    actSpraying: "Spraying",
    actFertilizer: "Fertilizer Application",
    actWeeding: "Weeding",
    actHarvest: "Harvesting",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    netProfit: "Net Profit",
    seasonSummary: "Kharif 2026 Season Summary",
    exportPdfReport: "Export Season Report (PDF / Print)",
    cropWiseProfit: "Crop-Wise Profitability",
    daysPassed: "Days since sowing",
    currentStage: "Current Stage",
    tasksDue: "Tasks Due Today",
    markDone: "Mark Done",
    taskCompleted: "Task completed!",
    cropDoctorTitle: "Crop Doctor (AI Scanner)",
    cropDoctorSubtitle: "Take or select a crop leaf photo for on-device diagnosis & treatment",
    uploadLeafPhoto: "Upload or Select Leaf Photo",
    scanNow: "Run AI Diagnosis",
    diagnosing: "Analyzing leaf patterns...",
    organicRemedy: "Organic / Natural Treatment",
    chemicalRemedy: "Recommended Chemical Treatment",
    govSchemesTitle: "Government Schemes & Subsidies",
    checkEligibility: "Check Instant Eligibility",
    eligibleBadge: "Eligible for Benefit",
    welcomeTitle: "KisanSetu Login",
    phoneLabel: "Mobile Number",
    enterOtp: "Enter 4-digit OTP",
    verifyLogin: "Sign In",
    demoLoginFarmer: "Demo Farmer: Ravi (3 Acres)",
    demoLoginFpo: "Demo FPO: Suresh Coordinator",
    selectLanguage: "Language / భాష / भाषा",
    acresLabel: "Land Holding (Acres)",
    villageLabel: "Village & District",
    soilLabel: "Soil Type"
  },
  te: {
    appName: "రైతు సేతు (KisanSetu)",
    appTagline: "రైతుల కోసం సులభమైన యాప్",
    navHome: "హోమ్",
    navPrices: "మార్కెట్ ధరలు",
    navDiary: "రైతు డైరీ",
    navProfit: "లాభనష్టాలు",
    navCalendar: "పంట క్యాలెండర్",
    navCropDoctor: "పంట వైద్యుడు",
    navSchemes: "పథకాలు",
    navFpo: "FPO అడ్మిన్",
    statusOnline: "ఆన్‌లైన్",
    statusOffline: "ఆఫ్‌లైన్ మోడ్",
    statusSyncing: "సమకాలీకరిస్తోంది...",
    statusAllSaved: "అన్నీ భద్రపరచబడ్డాయి",
    unsyncedEntries: "పెండింగ్ ఎంట్రీలు",
    syncNow: "ఇప్పుడే సమకాలీకరించు",
    lastUpdated: "ఇప్పుడే అప్‌డేట్ అయ్యింది",
    weatherToday: "నేటి వాతావరణం",
    rainAlert: "వర్షం హెచ్చరిక!",
    rainAlertSubtitle: "24-48 గంటల్లో భారీ వర్షం పడే అవకాశం ఉంది. మందుల పిచికారీని వాయిదా వేయండి.",
    humidity: "తేమ",
    wind: "గాలి",
    rainChance: "వర్ష సూచన",
    advisoryTitle: "వ్యవసాయ సలహా",
    mandiTitle: "లైవ్ మార్కెట్ ధరలు",
    mandiSubtitle: "సమీప మార్కెట్లలో నేటి ధరల వివరాలు",
    modalPrice: "సగటు ధర",
    minMaxPrice: "కనిష్ట - గరిష్ట",
    targetPriceAlert: "ధర హెచ్చరిక",
    setAlert: "హెచ్చరిక సెట్ చేయండి",
    alertSetSuccess: "ధర అలర్ట్ సెట్ అయ్యింది! లక్ష్య ధర రాగానే నోటిఫికేషన్ వస్తుంది.",
    sevenDayTrend: "గత 7 రోజుల ధరల ధోరణి",
    filterAll: "అన్ని పంటలు",
    distance: "దూరం",
    perQuintal: "/ క్వింటాల్ (100 కేజీలు)",
    quickLogBtn: "+ 15 సెకన్ల ఎంట్రీ",
    quickLogTitle: "త్వరిత ఎంట్రీ",
    logActivity: "పని నమోదు",
    logExpense: "ఖర్చు రాయండి",
    logIncome: "ఆదాయం నమోదు",
    amountLabel: "మొత్తం (₹)",
    selectCrop: "పంటను ఎంచుకోండి",
    selectCategory: "ఖర్చు వర్గం",
    voiceDictate: "వాయిస్ ద్వారా చెప్పండి (మైక్ నొక్కండి)",
    listening: "వింటోంది... ఉదా: 'కూలీల కోసం 500 రూపాయలు' అని చెప్పండి",
    saveEntry: "సేవ్ చేయండి (ఆఫ్‌లైన్‌లో పనిచేస్తుంది)",
    saving: "భద్రపరుస్తోంది...",
    savedSuccessfully: "డైరీలో భద్రపరచబడింది!",
    undo: "రద్దు చేయి (Undo)",
    quickKeypad: "త్వరిత కీప్యాడ్",
    clear: "క్లియర్",
    catSeeds: "విత్తనాలు",
    catFertilizer: "ఎరువులు",
    catLabor: "కూలీల ఖర్చు",
    catMachinery: "ట్రాక్టర్ / యంత్రాలు",
    catPesticides: "పురుగుమందులు",
    catTransport: "రవాణా ఖర్చు",
    catHarvestSale: "పంట అమ్మకం (ఆదాయం)",
    catOther: "ఇతర ఖర్చులు",
    actSowing: "విత్తడం",
    actIrrigation: "నీరు పెట్టడం",
    actSpraying: "మందు పిచికారీ",
    actFertilizer: "ఎరువులు వేయడం",
    actWeeding: "కలుపు తీత",
    actHarvest: "కోత కోయడం",
    totalIncome: "మొత్తం రాబడి",
    totalExpenses: "మొత్తం ఖర్చులు",
    netProfit: "నికర లాభం",
    seasonSummary: "ఖరీఫ్ 2026 సీజన్ లెక్కలు",
    exportPdfReport: "రిపోర్ట్ డౌన్‌లోడ్ (PDF / ప్రింట్)",
    cropWiseProfit: "పంటల వారీగా లాభ వివరాలు",
    daysPassed: "విత్తిన రోజుల సంఖ్య",
    currentStage: "ప్రస్తుత దశ",
    tasksDue: "ఈరోజు చేయవలసిన పనులు",
    markDone: "పూర్తయింది",
    taskCompleted: "పని పూర్తయింది!",
    cropDoctorTitle: "పంట డాక్టర్ (AI పరీక్ష)",
    cropDoctorSubtitle: "తెగులు గుర్తించడానికి ఆకు ఫోటో తీయండి లేదా ఎంచుకోండి",
    uploadLeafPhoto: "ఆకు ఫోటో ఎంచుకోండి",
    scanNow: "తెగులు పరీక్షించు",
    diagnosing: "ఆకును పరీక్షిస్తోంది...",
    organicRemedy: "సేంద్రీయ నివారణ",
    chemicalRemedy: "రసాయన నివారణ మందు",
    govSchemesTitle: "రైతు ప్రభుత్వ పథకాలు & సబ్సిడీలు",
    checkEligibility: "అర్హతను సరిచూసుకోండి",
    eligibleBadge: "పథకానికి అర్హులు",
    welcomeTitle: "రైతు సేతు లాగిన్",
    phoneLabel: "ఫోన్ నెంబర్",
    enterOtp: "OTP కోడ్ నమోదు చేయండి",
    verifyLogin: "లాగిన్ అవ్వండి",
    demoLoginFarmer: "డెమో రైతు: రవి (3 ఎకరాలు)",
    demoLoginFpo: "డెమో FPO: సురేష్ సమన్వయకర్త",
    selectLanguage: "భాష ఎంచుకోండి",
    acresLabel: "భూమి విస్తీర్ణం (ఎకరాలు)",
    villageLabel: "గ్రామం & జిల్లా",
    soilLabel: "నేల రకం"
  },
  hi: {
    appName: "किसान सेतु (KisanSetu)",
    appTagline: "छोटे किसानों के लिए सरल ऐप",
    navHome: "होम",
    navPrices: "मंडी भाव",
    navDiary: "फार्म डायरी",
    navProfit: "मुनाफा व खर्च",
    navCalendar: "फसल कैलेंडर",
    navCropDoctor: "क्रॉप डॉक्टर",
    navSchemes: "योजनाएं",
    navFpo: "FPO एडमिन",
    statusOnline: "ऑनलाइन",
    statusOffline: "ऑफ़लाइन मोड",
    statusSyncing: "सिंक हो रहा है...",
    statusAllSaved: "सब सहेजा गया",
    unsyncedEntries: "पेंडिंग एंट्री",
    syncNow: "अभी सिंक करें",
    lastUpdated: "अभी अपडेट किया गया",
    weatherToday: "आज का मौसम",
    rainAlert: "बारिश चेतावनी!",
    rainAlertSubtitle: "अगले 24-48 घंटों में भारी बारिश की संभावना। कीटनाशक छिड़काव टालें व जल निकासी देखें।",
    humidity: "नमी",
    wind: "हवा",
    rainChance: "बारिश",
    advisoryTitle: "कृषि सलाह",
    mandiTitle: "लाइव मंडी भाव",
    mandiSubtitle: "नजदीकी कृषि उपज मंडियों के आज के ताजा भाव",
    modalPrice: "मॉडल भाव",
    minMaxPrice: "न्यूनतम - अधिकतम",
    targetPriceAlert: "मूल्य अलर्ट",
    setAlert: "अलर्ट सेट करें",
    alertSetSuccess: "भाव अलर्ट सेट हो गया! लक्ष्य भाव पर पहुंचते ही सूचना मिलेगी।",
    sevenDayTrend: "7 दिनों का भाव रुझान",
    filterAll: "सभी फसलें",
    distance: "दूरी",
    perQuintal: "/ क्विंटल (100 किग्रा)",
    quickLogBtn: "+ 15 सेकंड एंट्री",
    quickLogTitle: "त्वरित एंट्री",
    logActivity: "खेत कार्य दर्ज करें",
    logExpense: "खर्च दर्ज करें",
    logIncome: "फसल बिक्री (आमदनी)",
    amountLabel: "राशि (₹)",
    selectCrop: "फसल चुनें",
    selectCategory: "खर्च की श्रेणी",
    voiceDictate: "बोलकर दर्ज करें (माइक दबाएं)",
    listening: "सुन रहे हैं... बोलें जैसे 'मजदूरी के 500 रुपये'",
    saveEntry: "सहेजें (ऑफ़लाइन भी काम करता है)",
    saving: "सहेज रहे हैं...",
    savedSuccessfully: "डायरी में सुरक्षित हो गया!",
    undo: "वापस लें (Undo)",
    quickKeypad: "त्वरित कीपैड",
    clear: "हटाएं",
    catSeeds: "बीज",
    catFertilizer: "उर्वरक / खाद",
    catLabor: "मजदूरी",
    catMachinery: "ट्रैक्टर / मशीन",
    catPesticides: "कीटनाशक",
    catTransport: "परिवहन / ढुलाई",
    catHarvestSale: "फसल बिक्री (आमदनी)",
    catOther: "अन्य खर्च",
    actSowing: "बुवाई",
    actIrrigation: "सिंचाई",
    actSpraying: "छिड़काव",
    actFertilizer: "उर्वरक डालना",
    actWeeding: "निराई-गुड़ाई",
    actHarvest: "कटाई",
    totalIncome: "कुल आमदनी",
    totalExpenses: "कुल खर्च",
    netProfit: "शुद्ध मुनाफा",
    seasonSummary: "खरीफ 2026 सीजन का लेखा-जोखा",
    exportPdfReport: "रिपोर्ट निकालें (PDF / प्रिंट)",
    cropWiseProfit: "फसल अनुसार मुनाफा",
    daysPassed: "बुवाई के दिन",
    currentStage: "वर्तमान अवस्था",
    tasksDue: "आज के जरूरी कार्य",
    markDone: "पूरा हुआ",
    taskCompleted: "कार्य पूरा किया गया!",
    cropDoctorTitle: "क्रॉप डॉक्टर (AI जांच)",
    cropDoctorSubtitle: "बीमारी की पहचान के लिए पत्ती की फोटो लें या चुनें",
    uploadLeafPhoto: "पत्ती की फोटो चुनें",
    scanNow: "रोग की जांच करें",
    diagnosing: "पत्ती की जांच हो रही है...",
    organicRemedy: "जैविक / देसी उपचार",
    chemicalRemedy: "रासायनिक उपचार दवा",
    govSchemesTitle: "सरकारी योजनाएं और सब्सिडी",
    checkEligibility: "पात्रता जांचें",
    eligibleBadge: "योजना के पात्र हैं",
    welcomeTitle: "किसान सेतु लॉगिन",
    phoneLabel: "मोबाइल नंबर",
    enterOtp: "4-अंकों का OTP दर्ज करें",
    verifyLogin: "लॉगिन करें",
    demoLoginFarmer: "डेमो किसान: रवि (3 एकड़)",
    demoLoginFpo: "डेमो FPO: सुरेश समन्वयक",
    selectLanguage: "भाषा चुनें",
    acresLabel: "जमीन (एकड़)",
    villageLabel: "गाँव और जिला",
    soilLabel: "मिट्टी का प्रकार"
  }
};
