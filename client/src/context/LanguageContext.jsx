import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Nav
    brandName: 'CivicFix',
    brandTagline: 'Report It. Track It. Improve Your City.',
    navHome: 'Home',
    navReport: 'Report Issue',
    navTrack: 'Track Status',
    navIssuesMap: 'Public Issues & Map',
    navDashboard: 'Dashboard',
    navAdmin: 'Admin Portal',
    navStaff: 'Staff Portal',
    navAbout: 'About',
    navHelp: 'Help & FAQs',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',
    roleCitizen: 'Citizen',
    roleAdmin: 'Administrator',
    roleStaff: 'Field Staff',
    
    // Hero & Home
    heroTag: 'Smart Municipal Governance Platform',
    heroTitle: 'Make Your City Better, Cleaner & Safer',
    heroSubtitle: 'Directly report road damage, garbage overflow, water leakage, or broken streetlights to municipal departments with real-time tracking.',
    btnReportNow: 'Report an Issue Now',
    btnTrackIssue: 'Track Complaint',
    btnViewMap: 'Explore Public Map',
    
    // Stats
    statTotal: 'Complaints Filed',
    statResolved: 'Issues Resolved',
    statRate: 'Resolution Rate',
    statAvgTime: 'Avg Resolution Time',
    
    // Categories
    catRoads: 'Roads & Footpaths',
    catWaste: 'Waste Management',
    catWater: 'Drainage & Water',
    catLighting: 'Street Lighting',
    catParks: 'Parks & Trees',
    catHealth: 'Public Health',
    
    // Statuses
    statusSUBMITTED: 'Submitted',
    statusUNDER_REVIEW: 'Under Review',
    statusVERIFIED: 'Verified',
    statusASSIGNED: 'Assigned to Staff',
    statusIN_PROGRESS: 'Work in Progress',
    statusRESOLVED: 'Resolved',
    statusREOPENED: 'Reopened',
    statusREJECTED: 'Rejected',
    statusCLOSED: 'Closed',
    
    // Forms
    formTitle: 'Report a Civic Issue',
    formSubtitle: 'Fill in details below to notify municipal authorities directly.',
    labelCategory: 'Select Issue Category',
    labelTitle: 'Issue Title',
    labelDescription: 'Problem Description',
    labelAddress: 'Street Address or Landmark',
    labelLandmark: 'Nearby Landmark (Optional)',
    labelUrgency: 'Urgency Level',
    labelPhoto: 'Upload Evidence Photos',
    labelLocation: 'Pinpoint Location on Map',
    btnSubmitIssue: 'Submit Official Complaint',
    
    // General
    loading: 'Loading...',
    saveDraft: 'Draft Saved Locally',
  },
  te: {
    // Nav
    brandName: 'సివిక్ ఫిక్స్ (CivicFix)',
    brandTagline: 'రిపోర్ట్ చేయండి. ట్రాక్ చేయండి. మీ నగరాన్ని మెరుగుపరచండి.',
    navHome: 'హోమ్',
    navReport: 'సమస్యను నివేదించండి',
    navTrack: 'స్టేటస్ ట్రాక్ చేయండి',
    navIssuesMap: 'ప్రజా సమస్యల మ్యాప్',
    navDashboard: 'నా డ్యాష్‌బోర్డ్',
    navAdmin: 'అడ్మిన్ పోర్టల్',
    navStaff: 'సిబ్బంది పోర్టల్',
    navAbout: 'మా గురించి',
    navHelp: 'సహాయం & FAQs',
    navLogin: 'లాగిన్',
    navRegister: 'రిజిస్టర్',
    navLogout: 'లాగౌట్',
    roleCitizen: 'పౌరుడు (Citizen)',
    roleAdmin: 'మునిసిపల్ అడ్మిన్',
    roleStaff: 'ఫీల్డ్ సిబ్బంది (Staff)',
    
    // Hero & Home
    heroTag: 'స్మార్ట్ సిటీ ప్రజా సమస్యల పరిష్కార వేదిక',
    heroTitle: 'మన నగరాన్ని పరిశుభ్రంగా, సురక్షితంగా ఉంచుకుందాం',
    heroSubtitle: 'రోడ్ల గుంతలు, చెత్త సమస్యలు, డ్రైనేజీ లీకేజీలు లేదా వీధి దీపాల సమస్యలను నేరుగా మునిసిపల్ విభాగానికి తెలియజేయండి. రియల్-టైమ్ స్టేటస్ ట్రాక్ చేయండి.',
    btnReportNow: 'సమస్యను రిపోర్ట్ చేయండి',
    btnTrackIssue: 'కంప్లైంట్ ట్రాక్ చేయండి',
    btnViewMap: 'పబ్లిక్ మ్యాప్ చూడండి',
    
    // Stats
    statTotal: 'మొత్తం నమోదైన ఫిర్యాదులు',
    statResolved: 'పరిష్కరించబడిన సమస్యలు',
    statRate: 'పరిష్కార శాతం',
    statAvgTime: 'సగటు పరిష్కార సమయం',
    
    // Categories
    catRoads: 'రోడ్లు & పాదచారుల మార్గాలు',
    catWaste: 'చెత్త & పారిశుద్ధ్య నిర్వహణ',
    catWater: 'డ్రైనేజీ & తాగునీటి లీకేజీలు',
    catLighting: 'వీధి దీపాలు & విద్యుత్',
    catParks: 'పార్క్లు & చెట్లు',
    catHealth: 'ప్రజారోగ్యం & శానిటేషన్',
    
    // Statuses
    statusSUBMITTED: 'సమర్పించబడింది (Submitted)',
    statusUNDER_REVIEW: 'సమీక్షలో ఉంది (Under Review)',
    statusVERIFIED: 'ధృవీకరించబడింది (Verified)',
    statusASSIGNED: 'సిబ్బందికి కేటాయించబడింది',
    statusIN_PROGRESS: 'పని పురోగతిలో ఉంది (In Progress)',
    statusRESOLVED: 'పరిష్కరించబడింది (Resolved)',
    statusREOPENED: 'మళ్లీ తెరవబడింది (Reopened)',
    statusREJECTED: 'తిరస్కరించబడింది',
    statusCLOSED: 'ముగిసింది (Closed)',
    
    // Forms
    formTitle: 'పౌర సమస్యను నమోదు చేయండి',
    formSubtitle: 'మునిసిపల్ అధికారులకు నేరుగా చేరడానికి క్రింది వివరాలను పూరించండి.',
    labelCategory: 'సమస్య వర్గాన్ని ఎంచుకోండి',
    labelTitle: 'సమస్య శీర్షిక',
    labelDescription: 'సమస్య పూర్తి వివరాలు',
    labelAddress: 'వీధి చిరునామా లేదా లొకేషన్',
    labelLandmark: 'సమీప ల్యాండ్‌మార్క్ (ఐచ్ఛికం)',
    labelUrgency: 'అత్యవసర స్థాయి',
    labelPhoto: 'ఫోటో లేదా ఆధారాలు అప్‌లోడ్ చేయండి',
    labelLocation: 'మ్యాప్‌లో లొకేషన్ ఎంచుకోండి',
    btnSubmitIssue: 'ఫిర్యాదును సమర్పించండి',
    
    // General
    loading: 'లోడ్ అవుతోంది...',
    saveDraft: 'చిత్తుప్రతి సేవ్ చేయబడింది',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('civicfix_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('civicfix_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
