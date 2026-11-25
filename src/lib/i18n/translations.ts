export type SupportedLanguage = 'en' | 'as' | 'hi' | 'bn';

export interface Translations {
  // Existing legacy/test keys (preserved for 100% test compatibility)
  portalTitle: string;
  portalSubtitle: string;
  skipToContent: string;
  helpline: string;
  prototypeBanner: string;
  prototypeDisclosure: string;
  searchPlaceholder: string;
  searchButton: string;
  heroHeadline: string;
  heroSubheadline: string;
  workflowsHeading: string;
  workflowsSubheading: string;
  trackSanction: string;
  coDistrictGis: string;
  reconcileFunds: string;
  fieldInspection: string;
  worksiteQr: string;
  publicGrievance: string;
  telemetryTitle: string;
  totalSchemes: string;
  geoTaggedAudits: string;
  reconciledRatio: string;
  activeVariances: string;
  spotlightTitle: string;
  spotlightSubtitle: string;
  financialDisbursed: string;
  physicalVerified: string;
  evidenceScore: string;
  viewQrCard: string;
  sahayTitle: string;
  sahayDisclaimer: string;
  askSahayPlaceholder: string;
  voiceSupported: string;
  readAloud: string;
  footerTagline: string;
  navOverview: string;
  navSchemes: string;
  navReconciliation: string;
  navMap: string;
  navNotices: string;
  navGrievances: string;
  navFieldVerify: string;
  navDashboard: string;
  navSignIn: string;
  navSignOut: string;
  navRegister: string;
  navAccessibility: string;
  navPolicies: string;
  highContrast: string;
  themeToggle: string;
  textSize: string;
  filterAll: string;
  filterSchemes: string;
  filterCoDistricts: string;
  filterNotices: string;
  filterWorkId: string;
  noResultsFound: string;
  trySearchingSuggestions: string;
  schemeRegistry: string;
  financialVsPhysical: string;
  tabAllWorks: string;
  tabVariance: string;
  tabStalled: string;
  tabPendingUc: string;
  tabDuplicate: string;
  adcEquityLens: string;
  exportCsv: string;
  statusOnTrack: string;
  statusStalled: string;
  statusVariance: string;
  statusCompleted: string;
  mapTitle: string;
  mapSubtitle: string;
  heatmapToggle: string;
  tableFallbackTitle: string;
  publicAuditDossier: string;
  statutoryMilestones: string;
  intelligenceBreakdown: string;
  geoTaggedPhotos: string;
  fileGrievanceForAsset: string;
  fileGrievanceTitle: string;
  trackGrievanceTitle: string;
  ticketCode: string;
  applicantName: string;
  applicantPhone: string;
  department: string;
  district: string;
  grievanceDescription: string;
  submitButton: string;
  draftSavedMessage: string;
  rtpsSlaNotice: string;
  dashboardTitle: string;
  weeklyExceptionsQueue: string;
  myDrafts: string;
  savedSchemes: string;
  inspectionQueue: string;
  freezeFundingAction: string;

  // Modern UI & Screen Keys
  // Navigation & Header
  navLedger: string;
  navVerify: string;
  navEligibility: string;
  navDirectory: string;
  navInsights: string;
  navLiveAudit: string;
  perspectiveLabel: string;
  citizenRole: string;
  officerRole: string;
  dcRole: string;

  // Accessibility Menu
  a11yTitle: string;
  a11yTextSize: string;
  a11yHighContrast: string;
  a11yEnhancedSpacing: string;
  a11yUnderlineLinks: string;
  a11yReduceMotion: string;
  a11yResetAll: string;
  a11yWcag: string;

  // Landing Page
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroExploreBtn: string;
  heroVerifyBtn: string;
  heroFloater1Tag: string;
  heroFloater1Title: string;
  heroFloater1Status: string;
  heroFloater2Tag: string;
  heroFloater2Title: string;
  heroFloater2Status: string;
  kpiHeading: string;
  kpiSubtitle: string;
  kpi1Val: string;
  kpi1Label: string;
  kpi1Sub: string;
  kpi2Val: string;
  kpi2Label: string;
  kpi2Sub: string;
  kpi3Val: string;
  kpi3Label: string;
  kpi3Sub: string;
  kpi4Val: string;
  kpi4Label: string;
  kpi4Sub: string;
  archTitle: string;
  archGis: string;
  archQr: string;
  archMesh: string;
  archAi: string;
  archApi: string;
  processTag: string;
  processHeading: string;
  processSubheading: string;
  phase1Title: string;
  phase1Desc: string;
  phase1Tag1: string;
  phase1Tag2: string;
  phase2Title: string;
  phase2Desc: string;
  phase2Tag: string;
  phase3Title: string;
  phase3Desc: string;
  phase3Tag: string;
  closingTag: string;
  closingTitle: string;
  closingDesc: string;
  closingBtn1: string;
  closingBtn2: string;

  // Dashboard Page
  dashOverview: string;
  dashDisbursementsVsGround: string;
  dashSubtitle: string;
  dashExportAudit: string;
  dashActiveSchemes: string;
  dashPhysicalProgress: string;
  dashFinancialUtilization: string;
  dashOpenAnomalies: string;
  dashInteractiveCartography: string;
  dashLiveTelemetry: string;
  dashReconciliationLedger: string;
  dashInventorySubtitle: string;

  // Asset Detail Page
  assetBreadcrumb: string;
  assetPrintPlaque: string;
  assetAuditQrPlaque: string;
  assetVerifiedOnTrack: string;
  assetDronePass: string;
  assetPolygonGeofenced: string;
  assetPhysicalCompletion: string;
  assetFinancialDisbursed: string;
  assetMilestoneTimeline: string;
  assetGramSabhaSignoff: string;

  // Verify Page
  verifyMobileTitle: string;
  verifyOfflineHeader: string;
  verifySubtitle: string;
  verifyRtkFix: string;
  verifyZeroDataLoss: string;
  verifySyncQueueTitle: string;
  verifySyncNow: string;
  verifyChecklistTitle: string;
  verifySubmitButton: string;

  // Notices Page
  noticesGazetteHeader: string;
  noticesTitle: string;
  noticesSubtitle: string;
  noticesSearchPlaceholder: string;
  noticesAll: string;
  noticesActive: string;
  noticesAmended: string;
  noticesSuperseded: string;
  noticesKeyTakeaways: string;
  noticesVerificationSeal: string;
  noticesDownloadPdf: string;

  // Eligibility Page
  eligibilityBadge: string;
  eligibilityHeading: string;
  eligibilitySubheading: string;
  eligibilityStep1: string;
  eligibilityStep2: string;
  eligibilityStep3: string;
  eligibilitySelectDistrict: string;
  eligibilitySelectArea: string;
  eligibilitySelectSector: string;
  eligibilityMatchedCount: string;

  // Directory Page
  dirBadge: string;
  dirHeading: string;
  dirSubtitle: string;
  dirSearchPlaceholder: string;
  dirAllHubs: string;
  dirRiverineFerries: string;
  dirEvMicroFeeder: string;
  dirKiosksHubs: string;
  dirActiveServices: string;
  dirWaterway: string;
  dirViewTrack: string;

  // Insights Page
  insightsBadge: string;
  insightsHeading: string;
  insightsSubtitle: string;
  insightsZeroBlackBox: string;
  insightsCard1Title: string;
  insightsCard1Val: string;
  insightsCard1Sub: string;
  insightsCard1Desc: string;
  insightsCard2Title: string;
  insightsCard2Val: string;
  insightsCard2Sub: string;
  insightsCard2Desc: string;
  insightsCard3Title: string;
  insightsCard3Val: string;
  insightsCard3Sub: string;
  insightsCard3Desc: string;
  insightsActiveTriggers: string;
  insightsExplainReasoning: string;
  insightsStatutoryAction: string;

  // Sahay AI Assistant
  sahayWelcome: string;
  sahayCopilotSubtitle: string;
  sahayInputPlaceholder: string;
  sahayConsulting: string;

  // Footer
  footerStatutoryLedger: string;
  footerCoreScreens: string;
  footerCivicChannels: string;
  footerIntegrity: string;
  footerCopyright: string;
  footerZeroSlop: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    portalTitle: 'Drishti — Assam Decentralised Planning & Social Audit Platform',
    portalSubtitle: 'State-Level Physical-Financial Reconciliation and Statutory Social Audit Ledger',
    skipToContent: 'Skip to Main Content',
    helpline: 'Toll-Free Helpline 1905 (Assam RTPS)',
    prototypeBanner: 'GIGW 3.0 Planning Baseline • Statutory Decentralised Planning System',
    prototypeDisclosure: 'Data refreshed daily from e-Prastuti, NESIDS & DoNER Treasury Ledgers',
    searchPlaceholder: 'Search scheme code, district (e.g., Darrang), co-district, or panchayat...',
    searchButton: 'Search',
    heroHeadline: 'Decentralised Planning. Absolute Ground Truth.',
    heroSubheadline: 'Real-time reconciliation of financial sanctions against geo-tagged on-site execution. Empowering 35 districts and 78 co-districts across Assam.',
    workflowsHeading: 'Statutory Verification Workflows',
    workflowsSubheading: 'Built to enforce Section 14(2) of Assam PR Act and GIGW 3.0 accessibility rules',
    trackSanction: 'Track Sanction & Approvals',
    coDistrictGis: 'Co-District GIS Map',
    reconcileFunds: 'Reconcile Funds & Physical Work',
    fieldInspection: 'Field Officer Inspection',
    worksiteQr: 'Worksite QR Plaques',
    publicGrievance: 'Public Grievance (RTPS)',
    telemetryTitle: 'Public Oversight Telemetry',
    totalSchemes: 'Total Sanctioned Schemes',
    geoTaggedAudits: 'Geo-Tagged Site Inspections',
    reconciledRatio: 'Verified Completion Ratio',
    activeVariances: 'Active Variance Alerts',
    spotlightTitle: 'Civic Audit Spotlight',
    spotlightSubtitle: 'Treasury release versus verified physical progress across priority sectors.',
    financialDisbursed: 'Financial Disbursed',
    physicalVerified: 'Physical Work Verified',
    evidenceScore: 'Evidence Score',
    viewQrCard: 'View Public QR Audit Card',
    sahayTitle: 'Sahay AI (সহায়)',
    sahayDisclaimer: 'AI Assistant • Not an Official Govt Order',
    askSahayPlaceholder: 'Ask in Assamese, English, Hindi, or Bengali...',
    voiceSupported: 'Voice search supported',
    readAloud: 'Listen in Assamese/English',
    footerTagline: 'Government of Assam, Planning & Development Department. Real-time audit for Gaon Panchayats & Autonomous Councils.',
    navOverview: 'Overview',
    navSchemes: 'Schemes & Works',
    navReconciliation: 'Reconciliation',
    navMap: 'GIS Map',
    navNotices: 'Notices',
    navGrievances: 'Grievances',
    navFieldVerify: 'Field Verify',
    navDashboard: 'Dashboard',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',
    navRegister: 'Register',
    navAccessibility: 'Accessibility',
    navPolicies: 'Policies & Privacy',
    highContrast: 'High Contrast Mode',
    themeToggle: 'Toggle Theme',
    textSize: 'Text Size',
    filterAll: 'All Categories',
    filterSchemes: 'Schemes & Grants',
    filterCoDistricts: 'Co-Districts (78)',
    filterNotices: 'Circulars & Notices',
    filterWorkId: 'Work ID',
    noResultsFound: 'No records found matching your criteria.',
    trySearchingSuggestions: 'Try searching for: Sipajhar, AS-DAR-0821, Bogibeel, Kokrajhar, or NESIDS.',
    schemeRegistry: 'Consolidated 11-Scheme Registry',
    financialVsPhysical: 'Financial vs. Physical Reconciliation Ledger',
    tabAllWorks: 'All Works',
    tabVariance: 'Variance Alerts (≥20%)',
    tabStalled: 'Stalled Projects (≥60 days)',
    tabPendingUc: 'Pending Utilization Certificates',
    tabDuplicate: 'Flagged Duplicate Claims',
    adcEquityLens: 'Sixth Schedule Equity Filter',
    exportCsv: 'Export CSV',
    statusOnTrack: 'On Track',
    statusStalled: 'Stalled',
    statusVariance: 'Variance Flagged',
    statusCompleted: 'Completed',
    mapTitle: 'Co-District GIS Spatial Audit Map',
    mapSubtitle: 'Geographic distribution across 35 districts, 78 co-districts, and Autonomous Councils.',
    heatmapToggle: 'District Risk Heatmap',
    tableFallbackTitle: 'Accessible Project List (Screen-Reader Fallback)',
    publicAuditDossier: 'Public Transparency & QR Audit Dossier',
    statutoryMilestones: 'Physical Milestones & Inspection Timeline',
    intelligenceBreakdown: 'Explainable Intelligence & Risk Flags',
    geoTaggedPhotos: 'Geo-Tagged Work Photos',
    fileGrievanceForAsset: 'File Grievance For This Asset',
    fileGrievanceTitle: 'Citizen Grievance Filing (Assam RTPS Act 2012)',
    trackGrievanceTitle: 'Track Grievance Status',
    ticketCode: 'Ticket Reference Code',
    applicantName: 'Applicant Name',
    applicantPhone: 'Mobile Number',
    department: 'Department',
    district: 'District / Co-District',
    grievanceDescription: 'Detailed description of stalled work or quality variance',
    submitButton: 'Submit Statutory Grievance',
    draftSavedMessage: 'Draft saved securely on your device.',
    rtpsSlaNotice: 'Mandatory 15-day resolution window under Assam Right to Public Services Act 2012.',
    dashboardTitle: 'Personalized Workspace',
    weeklyExceptionsQueue: 'Weekly Exception Review Queue (DC/ADC)',
    myDrafts: 'Incomplete Offline Drafts',
    savedSchemes: 'Bookmarked Schemes',
    inspectionQueue: 'Field Inspection Assignment Queue',
    freezeFundingAction: 'Issue Stop-Work Notice (Sec 14(2))',

    // Modern UI & Screen Keys
    navLedger: 'Ledger',
    navVerify: 'Verify',
    navEligibility: 'Eligibility',
    navDirectory: 'Directory',
    navInsights: 'Insights',
    navLiveAudit: 'Live Audit',
    perspectiveLabel: 'Perspective:',
    citizenRole: 'Citizen',
    officerRole: 'Field Officer',
    dcRole: 'Auditor / DC',

    a11yTitle: 'Accessibility Options',
    a11yTextSize: 'Text Size',
    a11yHighContrast: 'High Contrast',
    a11yEnhancedSpacing: 'Enhanced Spacing',
    a11yUnderlineLinks: 'Underline Links',
    a11yReduceMotion: 'Reduce Motion',
    a11yResetAll: 'Reset all',
    a11yWcag: 'WCAG 2.2 AA compliant',

    heroBadge: 'Real-time public infrastructure ledger',
    heroTitle1: 'Track every public promise,',
    heroTitle2: 'from sanction to soil.',
    heroSubtitle: 'Assam sovereign physical-financial reconciliation ledger. Satellite verification, offline mesh audits, and multilingual intelligence for every citizen.',
    heroExploreBtn: 'Explore Audit Ledger',
    heroVerifyBtn: 'Field Verification',
    heroFloater1Tag: 'Brahmaputra Basin',
    heroFloater1Title: 'Majuli Bund Reinforcement',
    heroFloater1Status: '₹48.2 Cr • 84% Completed',
    heroFloater2Tag: 'Latest Field Audit',
    heroFloater2Title: 'Jorhat Community Primary Health Wing',
    heroFloater2Status: 'Verified by Gram Sabha #14',
    kpiHeading: '15 Canonical Works verified in the open.',
    kpiSubtitle: 'Radical transparency at village level. No locked PDF reports, no delayed audits.',
    kpi1Val: '40%',
    kpi1Label: 'Faster Audits',
    kpi1Sub: 'From sanction to field dispatch',
    kpi2Val: '35+',
    kpi2Label: 'Districts Connected',
    kpi2Sub: 'From Dhubri to Tinsukia',
    kpi3Val: '93.3%',
    kpi3Label: 'Ledger Match',
    kpi3Sub: 'Direct Treasury to geotag proof',
    kpi4Val: '4',
    kpi4Label: 'Official Languages',
    kpi4Sub: 'Assamese, Bodo, Bengali & English',
    archTitle: 'Core Architecture',
    archGis: 'GIS Geo-Tagging',
    archQr: 'QR Public Audit',
    archMesh: 'Offline Mesh Sync',
    archAi: 'Sahay Multilingual AI',
    archApi: 'Open Ledger API',
    processTag: 'How Drishti works',
    processHeading: 'Clarity at every step of the lifecycle.',
    processSubheading: 'From cabinet financial sanctions down to grass-root soil testing and gram sabha approval.',
    phase1Title: 'Sanction & Map',
    phase1Desc: 'Administrative approvals and departmental budgets are ingested directly from the state treasury system. Drishti automatically pins precise cadastral GPS coordinates and delineates project catchments before any contractor bids.',
    phase1Tag1: 'Treasury Ingestion API',
    phase1Tag2: 'GIS Polygon Mapping',
    phase2Title: 'Soil & Ground Audit',
    phase2Desc: 'Field inspectors and local village monitoring units capture cryptographically signed photographs and geotagged timestamp benchmarks on-site with anti-spoof EXIF extraction.',
    phase2Tag: 'QR Mobile Verification',
    phase3Title: 'Public Proof & Signoff',
    phase3Desc: 'Final release of contractor milestones requires public sign-off. Open ledgers accessible in Assamese, Bodo, Bengali, and English via Sahay AI.',
    phase3Tag: 'Gram Sabha Attestation',
    closingTag: 'Open Access Civic Registry',
    closingTitle: 'Start exploring Drishti.',
    closingDesc: 'Query sanctions, inspect public works in your panchayat, or verify geotagged field reports in seconds.',
    closingBtn1: 'Launch Public Explorer',
    closingBtn2: 'Check Scheme Eligibility',

    dashOverview: 'State Infrastructure Reconciliation Overview',
    dashDisbursementsVsGround: 'Cross-Referencing Treasury Disbursements Against Satellite & Ground Telemetry',
    dashSubtitle: 'Real-time physical-financial ledger covering all 35 territorial districts of Assam.',
    dashExportAudit: 'Export Verified Audit',
    dashActiveSchemes: 'Active Schemes Tracked',
    dashPhysicalProgress: 'Physical Progress',
    dashFinancialUtilization: 'Financial Utilization',
    dashOpenAnomalies: 'Open Anomalies',
    dashInteractiveCartography: 'Interactive GIS Scheme Cartography',
    dashLiveTelemetry: 'Live telemetry layer with spatial cadastral pins',
    dashReconciliationLedger: 'Reconciliation Ledger',
    dashInventorySubtitle: 'Complete inventory of sanctioned public works with GPS verification status',

    assetBreadcrumb: 'Back to Audit Ledger',
    assetPrintPlaque: 'Print Plaque',
    assetAuditQrPlaque: 'Audit QR Plaque',
    assetVerifiedOnTrack: 'Verified · On Track',
    assetDronePass: 'Drone Orthomosaic Pass · Today 06:14 IST',
    assetPolygonGeofenced: 'Polygon Geo-Fenced',
    assetPhysicalCompletion: 'Physical Completion',
    assetFinancialDisbursed: 'Financial Disbursed',
    assetMilestoneTimeline: 'Milestone & Ground Audit Timeline',
    assetGramSabhaSignoff: 'Gram Sabha Sign-Off',

    verifyMobileTitle: 'Mobile Field Verification',
    verifyOfflineHeader: 'Offline-First On-Site Verification',
    verifySubtitle: 'Tamper-proof physical audit with GPS coordinate locking and local queueing.',
    verifyRtkFix: 'RTK Fix Verified (0.38m)',
    verifyZeroDataLoss: 'Zero Data Loss Protocol',
    verifySyncQueueTitle: 'Local Sync Queue',
    verifySyncNow: 'Sync Now',
    verifyChecklistTitle: 'On-Site Quality Checklist',
    verifySubmitButton: 'Submit Ground Verification',

    noticesGazetteHeader: 'Official Assam Gazette Circulars',
    noticesTitle: 'Statutory Circulars & Scheme Updates',
    noticesSubtitle: 'Authoritative administrative orders, fund freeze mandates, and public social audit notices.',
    noticesSearchPlaceholder: 'Search circulars, orders, scheme names...',
    noticesAll: 'ALL',
    noticesActive: 'ACTIVE',
    noticesAmended: 'AMENDED',
    noticesSuperseded: 'SUPERSEDED',
    noticesKeyTakeaways: 'Sahay Executive Summary: Key Takeaways',
    noticesVerificationSeal: 'Official Assam Gazette Seal Verified',
    noticesDownloadPdf: 'Download Official Circular (PDF)',

    eligibilityBadge: 'Statutory Benefit Matcher',
    eligibilityHeading: 'Find public welfare, grants, and schemes you are entitled to.',
    eligibilitySubheading: 'Answer 3 quick questions. We cross-reference government gazette rules to show exactly what you qualify for and which documents you need.',
    eligibilityStep1: '01 Profile & Livelihood',
    eligibilityStep2: '02 Location & Need',
    eligibilityStep3: '03 Matched Schemes',
    eligibilitySelectDistrict: '1. Administrative District & Cadastral Terrain',
    eligibilitySelectArea: '2. Habitat & Riparian Classification',
    eligibilitySelectSector: '3. Primary Welfare or Infrastructure Requirement',
    eligibilityMatchedCount: 'Schemes You Qualify For',

    dirBadge: 'Brahmaputra Valley Multi-Modal Mesh',
    dirHeading: 'Find shared routes and civic hubs.',
    dirSubtitle: 'Real-time riverine ferry schedules, rural feeder EV vans, block development offices, and decentralized offline verification kiosks across Assam.',
    dirSearchPlaceholder: 'Search routes, ferry ghats, block offices, or kiosks...',
    dirAllHubs: 'All Hubs (42)',
    dirRiverineFerries: 'Riverine Ferries',
    dirEvMicroFeeder: 'EV Micro-Feeder',
    dirKiosksHubs: 'Kiosks & Hubs',
    dirActiveServices: 'Active Civic Services',
    dirWaterway: 'waterway',
    dirViewTrack: 'View Real-Time Track',

    insightsBadge: 'Data Storytelling & Anomaly Attribution',
    insightsHeading: 'Explainable Intelligence & Audit Insights',
    insightsSubtitle: 'Plain-language causal attribution for budget variances, stalled works, and district performance.',
    insightsZeroBlackBox: 'Zero Black-Box Scoring',
    insightsCard1Title: 'Reconciled Flow Integrity',
    insightsCard1Val: '93.3%',
    insightsCard1Sub: 'Telemetry Aligned',
    insightsCard1Desc: '14 of 15 canonical works matched with zero physical-fiscal variance.',
    insightsCard2Title: 'Multi-Spectral Ground Delta',
    insightsCard2Val: '4.8%',
    insightsCard2Sub: 'Sentinel-2 Surface Variance',
    insightsCard2Desc: 'Zero ghost projects detected across all satellite passes.',
    insightsCard3Title: 'Panchayat Anomaly Density',
    insightsCard3Val: '1.2%',
    insightsCard3Sub: '28 Works Under Investigation',
    insightsCard3Desc: 'Auto-routed to respective Deputy Commissioners.',
    insightsActiveTriggers: 'Active Variance Flag Triggers',
    insightsExplainReasoning: 'Causal Attribution & Technical Reasoning',
    insightsStatutoryAction: 'Mandated Statutory Action',

    sahayWelcome: 'Hello! I am Sahay AI (সহায়). Ask me about Assam development schemes, Sipajhar water project status, statutory audits, or how to file an RTPS grievance.',
    sahayCopilotSubtitle: 'Multilingual Citizen & Scheme Copilot',
    sahayInputPlaceholder: 'Ask Sahay AI in any language...',
    sahayConsulting: 'Consulting statutory knowledge base...',

    footerStatutoryLedger: 'Statutory decentralised planning & physical-financial verification ledger for the Government of Assam and North Eastern Region.',
    footerCoreScreens: 'Core Screens',
    footerCivicChannels: 'Civic Channels',
    footerIntegrity: 'Integrity & Compliance',
    footerCopyright: 'Drishti (দৃষ্টি). Open Statutory Public Ledger.',
    footerZeroSlop: 'Drishti Editorial Standard • Zero-slop interface',
  },

  as: {
    portalTitle: 'দৃষ্টি — অসম বিকেন্দ্ৰীভূত পৰিকল্পনা আৰু সামাজিক অডিট মঞ্চ',
    portalSubtitle: 'ৰাজ্যিক স্তৰৰ ভৌতিক-বিত্তীয় সমন্বয় আৰু সংবিধিবদ্ধ সামাজিক অডিট লেজাৰ',
    skipToContent: 'মুখ্য বিষয়বস্তুলৈ যাওক',
    helpline: 'টোল-ফ্ৰী হেল্পলাইন ১৯০৫ (অসম আৰটিপিএছ)',
    prototypeBanner: 'GIGW ৩.০ অনুৱৰ্তী প’ৰ্টেল • সংবিধিবদ্ধ বিকেন্দ্ৰীভূত পৰিকল্পনা ব্যৱস্থা',
    prototypeDisclosure: 'ই-প্ৰস্তুতি, NESIDS আৰু DoNER কোষাগাৰ লেজাৰৰ পৰা দৈনিক নবীকৰণকৃত',
    searchPlaceholder: 'আঁচনি ক’ড, জিলা (যেনে দৰং), উপ-জিলা বা পঞ্চায়ত সন্ধান কৰক...',
    searchButton: 'সন্ধান কৰক',
    heroHeadline: 'বিকেন্দ্ৰীভূত পৰিকল্পনা। সম্পূৰ্ণ বাস্তৱ সত্যতা।',
    heroSubheadline: 'জিঅ’-টেগযুক্ত স্থানত কামৰ বিপৰীতে বিত্তীয় অনুমোদনৰ ক্ষিপ্ৰ সমন্বয়। অসমৰ ৩৫ খন জিলা আৰু ৭৮ টা সহ-জিলাক সৱলীকৰণ।',
    workflowsHeading: 'সংবিধিবদ্ধ সত্যতা নিৰূপণ প্ৰক্ৰিয়া',
    workflowsSubheading: 'অসম পঞ্চায়তী ৰাজ আইনৰ ১৪(২) ধাৰা আৰু GIGW ৩.০ নিয়ম পালনৰ বাবে নিৰ্মিত',
    trackSanction: 'মঞ্জুৰী আৰু অনুমোদন নিৰীক্ষণ',
    coDistrictGis: 'সহ-জিলা জিআইএছ মেপ',
    reconcileFunds: 'তহবিল আৰু বাস্তৱ কামৰ সমন্বয়',
    fieldInspection: 'ক্ষেত্ৰ বিষয়াৰ পৰিদৰ্শন',
    worksiteQr: 'কাৰ্যক্ষেত্ৰৰ কিউআৰ ফলক',
    publicGrievance: 'ৰাজহুৱা ওজৰ-আপত্তি (RTPS)',
    telemetryTitle: 'ৰাজহুৱা নিৰীক্ষণ টেলিমেট্ৰি',
    totalSchemes: 'মুঠ অনুমোদিত আঁচনি',
    geoTaggedAudits: 'জিঅ’-টেগযুক্ত ক্ষেত্ৰ পৰিদৰ্শন',
    reconciledRatio: 'প্ৰমাণিত কামৰ অনুপাত',
    activeVariances: 'সক্ৰিয় বিসংগতি সতৰ্কতা',
    spotlightTitle: 'নাগৰিক অডিট স্পটলাইট',
    spotlightSubtitle: 'কোষাগাৰৰ ব্যয় বনাম প্ৰাথমিক ক্ষেত্ৰত বাস্তৱিক অগ্ৰগতিৰ স্পষ্ট তুলনা।',
    financialDisbursed: 'বিতৰণ কৰা ধন',
    physicalVerified: 'পৰীক্ষিত ভৌতিক কাম',
    evidenceScore: 'প্ৰমাণ স্ক’ৰ',
    viewQrCard: 'ৰাজহুৱা কিউআৰ অডিট কাৰ্ড চাওক',
    sahayTitle: 'সহায় এআই (Sahay AI)',
    sahayDisclaimer: 'এআই সহায়িকা • চৰকাৰী আদেশ নহয়',
    askSahayPlaceholder: 'অসমীয়া, ইংৰাজী, হিন্দী বা বাংলাত সোধক...',
    voiceSupported: 'কণ্ঠ অনুসন্ধান সমৰ্থিত',
    readAloud: 'অসমীয়াত শুনক',
    footerTagline: 'অসম চৰকাৰ, পৰিকল্পনা আৰু উন্নয়ন বিভাগ। গাঁও পঞ্চায়ত আৰু স্বায়ত্তশাসিত পৰিষদৰ বাবে ৰিয়েল-টাইম অডিট।',
    navOverview: 'অৱলোকন',
    navSchemes: 'আঁচনি আৰু কামসমূহ',
    navReconciliation: 'তহবিল সমন্বয়',
    navMap: 'জিআইএছ মেপ',
    navNotices: 'জাননীসমূহ',
    navGrievances: 'অভিযোগ (RTPS)',
    navFieldVerify: 'ক্ষেত্ৰ পৰীক্ষণ',
    navDashboard: 'ডেশ্বব’ৰ্ড',
    navSignIn: 'লগ ইন',
    navSignOut: 'লগ আউট',
    navRegister: 'পঞ্জীয়ন',
    navAccessibility: 'অভিগম্যতা',
    navPolicies: 'নীতি আৰু গোপনীয়তা',
    highContrast: 'উচ্চ বৈসাদৃশ্য মোড',
    themeToggle: 'থিম সলনি কৰক',
    textSize: 'আখৰৰ আকাৰ',
    filterAll: 'সকলো শ্ৰেণী',
    filterSchemes: 'আঁচনি আৰু অনুদান',
    filterCoDistricts: 'সহ-জিলাসমূহ (৭৮)',
    filterNotices: 'বিজ্ঞপ্তি আৰু জাননী',
    filterWorkId: 'কাৰ্য্য আইডি',
    noResultsFound: 'আপোনাৰ মাপকাঠীৰ সৈতে কোনো তথ্য পোৱা নগ’ল।',
    trySearchingSuggestions: 'সন্ধান কৰক: চিপাঝাৰ, AS-DAR-0821, বগীবিল, কোকৰাঝাৰ, বা NESIDS।',
    schemeRegistry: 'একত্ৰিত ১১খন আঁচনিৰ পঞ্জী',
    financialVsPhysical: 'বিত্তীয় বনাম ভৌতিক অগ্ৰগতি লেজাৰ',
    tabAllWorks: 'সকলো কাম',
    tabVariance: 'বিসংগতি সতৰ্কতা (≥২০%)',
    tabStalled: 'স্থগিত প্ৰকল্প (≥৬০ দিন)',
    tabPendingUc: 'বাকী থকা ইউচি (UC)',
    tabDuplicate: 'সন্দেহজনক নকল দাবী',
    adcEquityLens: 'ষষ্ঠ অনুসূচী সমতা ফিল্টাৰ',
    exportCsv: 'চিএছভি এক্সপ’ৰ্ট',
    statusOnTrack: 'চলমান',
    statusStalled: 'স্থগিত',
    statusVariance: 'বিসংগতি চিহ্নিত',
    statusCompleted: 'সম্পূৰ্ণ',
    mapTitle: 'সহ-জিলা জিআইএছ স্থানিক অডিট মেপ',
    mapSubtitle: '৩৫ খন জিলা, ৭৮ টা সহ-জিলা আৰু স্বায়ত্তশাসিত পৰিষদৰ ভৌগোলিক বিস্তাৰ।',
    heatmapToggle: 'জিলা আশংকা হিটমেপ',
    tableFallbackTitle: 'সুলভ প্ৰকল্প তালিকা (স্ক্ৰীণ-ৰিডাৰ সহায়ক)',
    publicAuditDossier: 'ৰাজহুৱা স্বচ্ছতা আৰু কিউআৰ অডিট নথিপত্ৰ',
    statutoryMilestones: 'ভৌতিক মাইলৰ খুঁটি আৰু পৰিদৰ্শন সময়ৰেখা',
    intelligenceBreakdown: 'ব্যাখ্যামূলক বুদ্ধিমত্তা আৰু আশংকা সংকেত',
    geoTaggedPhotos: 'জিঅ’-টেগযুক্ত কামৰ ফটো',
    fileGrievanceForAsset: 'এই কামৰ বাবে অভিযোগ দাখিল কৰক',
    fileGrievanceTitle: 'নাগৰিক অভিযোগ দাখিল (অসম আৰটিপিএছ আইন ২০১২)',
    trackGrievanceTitle: 'অভিযোগৰ স্থিতি নিৰীক্ষণ',
    ticketCode: 'টিকট ক’ড',
    applicantName: 'আবেদনকাৰীৰ নাম',
    applicantPhone: 'ম’বাইল নম্বৰ',
    department: 'বিভাগ',
    district: 'জিলা / সহ-জিলা',
    grievanceDescription: 'স্থগিত কাম বা গুণগত বিসংগতিৰ সবিশেষ বিৱৰণ',
    submitButton: 'সংবিধিবদ্ধ অভিযোগ দাখিল কৰক',
    draftSavedMessage: 'খচৰা আপোনাৰ ডিভাইচত সুৰক্ষিতভাৱে সংৰক্ষণ কৰা হৈছে।',
    rtpsSlaNotice: 'অসম লোকসেৱা প্ৰদান অধিকাৰ আইন ২০১২-ৰ অধীনত বাধ্যতামূলক ১৫ দিনৰ সময়সীমা।',
    dashboardTitle: 'ব্যক্তিগত ৱৰ্কস্পেচ',
    weeklyExceptionsQueue: 'সাপ্তাহিক ব্যতিক্ৰম পৰ্যালোচনা তালিকা (ডিচি)',
    myDrafts: 'অসম্পূৰ্ণ অফলাইন খচৰা',
    savedSchemes: 'সংৰক্ষিত আঁচনিসমূহ',
    inspectionQueue: 'ক্ষেত্ৰ পৰিদৰ্শনৰ কাৰ্য্যসূচী',
    freezeFundingAction: 'কাম বন্ধৰ জাননী জাৰি কৰক (ধাৰা ১৪(২))',

    navLedger: 'লেজাৰ',
    navVerify: 'যাচাই কৰক',
    navEligibility: 'যোগ্যতা',
    navDirectory: 'পঞ্জী',
    navInsights: 'অন্তৰ্দৃষ্টি',
    navLiveAudit: 'সরাসৰি অডিট',
    perspectiveLabel: 'দৃষ্টিকোণ:',
    citizenRole: 'নাগৰিক',
    officerRole: 'ক্ষেত্ৰ বিষয়া',
    dcRole: 'অডিটৰ / ডিচি',

    a11yTitle: 'প্ৰৱেশাধিকাৰ বিকল্পসমূহ',
    a11yTextSize: 'পাঠৰ আকাৰ',
    a11yHighContrast: 'উচ্চ বৈসাদৃশ্য',
    a11yEnhancedSpacing: 'বর্ধিত স্থান',
    a11yUnderlineLinks: 'লিংক ৰেখাংকন',
    a11yReduceMotion: 'গতি হ্ৰাস',
    a11yResetAll: 'সকলো পুনৰায় সাজক',
    a11yWcag: 'WCAG ২.২ AA মানসম্পন্ন',

    heroBadge: 'প্ৰকৃত সময়ৰ ৰাজহুৱা আন্তঃগাঁথনি লেজাৰ',
    heroTitle1: 'প্ৰতিটো ৰাজহুৱা প্ৰতিশ্ৰুতি নিৰীক্ষণ কৰক,',
    heroTitle2: 'মঞ্জুৰীৰ পৰা মাটি পৰ্যন্ত।',
    heroSubtitle: 'অসমৰ সাৰ্বভৌম ভৌতিক-বিত্তীয় সমন্বয় লেজাৰ। উপগ্ৰহীয় সত্যতা নিৰূপণ, অফলাইন মেশ্ব অডিট আৰু প্ৰতিজন নাগৰিকৰ বাবে বহুভাষিক বুদ্ধিমত্তা।',
    heroExploreBtn: 'অডিট লেজাৰ চাওক',
    heroVerifyBtn: 'ক্ষেত্ৰ পৰীক্ষণ',
    heroFloater1Tag: 'ব্ৰহ্মপুত্ৰ উপত্যকা',
    heroFloater1Title: 'মাজুলী মথাউৰি সুদৃঢ়কৰণ',
    heroFloater1Status: '₹৪৮.২ কোটি • ৮৪% সম্পূৰ্ণ',
    heroFloater2Tag: 'শেহতীয়া ক্ষেত্ৰ পৰীক্ষা',
    heroFloater2Title: 'যোৰহাট সম্প্ৰদায় প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ',
    heroFloater2Status: 'গ্ৰাম সভা নং ১৪ দ্বাৰা প্ৰমাণিত',
    kpiHeading: '১২,৪০০+ কাম মুকলিকৈ প্ৰমাণিত।',
    kpiSubtitle: 'গাঁও পৰ্যায়ত নিৰ্ভুল স্বচ্ছতা। কোনো বন্ধ পিডিএ্ফ ৰিপৰ্ট নাই, কোনো পলম হোৱা অডিট নাই।',
    kpi1Val: '৪০%',
    kpi1Label: 'দ্ৰুত অডিট',
    kpi1Sub: 'মঞ্জুৰীৰ পৰা ক্ষেত্ৰ প্ৰেৰণলৈ',
    kpi2Val: '৩৫+',
    kpi2Label: 'সংযুক্ত জিলাসমূহ',
    kpi2Sub: 'ধুবুৰীৰ পৰা তিনিচুকীয়ালৈ',
    kpi3Val: '৯৯.২%',
    kpi3Label: 'লেজাৰ সাদৃশ্য',
    kpi3Sub: 'পোনপটীয়া কোষাগাৰৰ পৰা জিঅ’টেগ প্ৰমাণ',
    kpi4Val: '৪',
    kpi4Label: 'চৰকাৰী ভাষাসমূহ',
    kpi4Sub: 'অসমীয়া, বড়ো, বাংলা আৰু ইংৰাজী',
    archTitle: 'মূল স্থাপত্য',
    archGis: 'জিআইএছ জিঅ’-টেগিং',
    archQr: 'কিউআৰ ৰাজহুৱা অডিট',
    archMesh: 'অফলাইন মেশ্ব সংমিশ্ৰণ',
    archAi: 'সহায় বহুভাষিক এআই',
    archApi: 'মুকলি লেজাৰ এপিআই',
    processTag: 'দৃষ্টিয়ে কেনেকৈ কাম কৰে',
    processHeading: 'জীৱনচক্ৰৰ প্ৰতিটো পদক্ষেপতে স্পষ্টতা।',
    processSubheading: 'কেবিনেটৰ বিত্তীয় অনুমোদনৰ পৰা আৰম্ভ কৰি তৃণমূল পৰ্যায়ৰ মাটি পৰীক্ষা আৰু গ্ৰাম সভাৰ অনুমোদনলৈকে।',
    phase1Title: 'মঞ্জুৰী আৰু মানচিত্ৰায়ন',
    phase1Desc: 'প্ৰশাসনিক অনুমোদন আৰু বিভাগীয় বাজেটসমূহ ৰাজ্যিক কোষাগাৰ ব্যৱস্থাৰ পৰা পোনপটীয়াকৈ অন্তৰ্ভুক্ত কৰা হয়। ঠিকাদাৰে নিবিদা দিয়ালৈকে দৃষ্টিয়ে স্বয়ংক্ৰিয়ভাৱে সঠিক কেডাষ্ট্ৰেল জিপিএছ স্থানাংক নিৰ্ধাৰণ কৰে।',
    phase1Tag1: 'কোষাগাৰ অন্তৰ্ভুক্তি API',
    phase1Tag2: 'জিআইএছ বহুভুজ মানচিত্ৰায়ন',
    phase2Title: 'মাটি আৰু ক্ষেত্ৰ অডিট',
    phase2Desc: 'ক্ষেত্ৰ পৰিদৰ্শক আৰু স্থানীয় গাঁও নিৰীক্ষণ গোটসমূহে অন-ছাইটত ক্ৰিপ্টোগ্ৰাফিকভাবে স্বাক্ষৰিত আলোকচিত্ৰ আৰু জিঅ’টেগযুক্ত টাইমষ্টেম্প মানদণ্ড সংগ্ৰহ কৰে।',
    phase2Tag: 'কিউআৰ মোবাইল পৰীক্ষণ',
    phase3Title: 'ৰাজহুৱা প্ৰমাণ আৰু অনুমোদন',
    phase3Desc: 'ঠিকাদাৰৰ কিস্তি মুকলিৰ বাবে ৰাজহুৱা অনুমোদন বাধ্যতামূলক। সহায় এআইৰ জৰিয়তে অসমীয়া, বড়ো, বাংলা আৰু ইংৰাজীত মুক্তভাৱে তথ্যসমূহ উপলব্ধ।',
    phase3Tag: 'গ্ৰাম সভাৰ প্ৰমাণপত্ৰ',
    closingTag: 'মুকলি প্ৰৱেশাধিকাৰ নাগৰিক পঞ্জী',
    closingTitle: 'দৃষ্টি অন্বেষণ কৰক।',
    closingDesc: 'মঞ্জুৰী অনুসন্ধান কৰক, আপোনাৰ পঞ্চায়তত ৰাজহুৱা কাম পৰিদৰ্শন কৰক, নাইবা ছেকেণ্ডৰ ভিতৰত জিঅ’টেগযুক্ত ক্ষেত্ৰ প্ৰতিবেদনসমূহ পৰীক্ষা কৰক।',
    closingBtn1: 'ৰাজহুৱা এক্সপ্ল’ৰাৰ খোলক',
    closingBtn2: 'আঁচনিৰ যোগ্যতা চাওক',

    dashOverview: 'ৰাজ্যিক আন্তঃগাঁথনি সমন্বয় অৱলোকন',
    dashDisbursementsVsGround: 'উপগ্ৰহ আৰু ক্ষেত্ৰীয় টেলিমেট্ৰিৰ বিপৰীতে কোষাগাৰৰ ব্যয়ৰ সমন্বয়',
    dashSubtitle: 'অসমৰ ৩৫ খন জিলা সামৰি লোৱা প্ৰকৃত সময়ৰ ভৌতিক-বিত্তীয় লেজাৰ।',
    dashExportAudit: 'প্ৰমাণিত অডিট ৰপ্তানি কৰক',
    dashActiveSchemes: 'সক্ৰিয় আঁচনিসমূহ',
    dashPhysicalProgress: 'ভৌতিক অগ্ৰগতি',
    dashFinancialUtilization: 'বিত্তীয় ব্যৱহাৰ',
    dashOpenAnomalies: 'সক্ৰিয় বিসংগতি',
    dashInteractiveCartography: 'ইণ্টাৰেক্টিভ জিআইএছ কাৰ্টোগ্ৰাফী',
    dashLiveTelemetry: 'স্থানিক কেডাষ্ট্ৰেল পিনসহ প্ৰত্যক্ষ টেলিমেট্ৰি স্তৰ',
    dashReconciliationLedger: 'সমন্বয় লেজাৰ',
    dashInventorySubtitle: 'জিপিএছ পৰীক্ষণ স্থিতিৰ সৈতে অনুমোদিত ৰাজহুৱা কামৰ সম্পূৰ্ণ তালিকা',

    assetBreadcrumb: 'অডিট লেজাৰলৈ ঘূৰি যাওক',
    assetPrintPlaque: 'ফলক প্ৰিণ্ট কৰক',
    assetAuditQrPlaque: 'অডিট কিউআৰ ফলক',
    assetVerifiedOnTrack: 'প্ৰমাণিত · সঠিক পথত',
    assetDronePass: 'ড্ৰোন অৰ্থমোজাইক পাছ · আজি পুৱা ০৬:১৪ বজাত',
    assetPolygonGeofenced: 'বহুভুজ জিঅ’-ফেঞ্চড',
    assetPhysicalCompletion: 'ভৌতিক সমাপ্তি',
    assetFinancialDisbursed: 'বিত্তীয় বিতৰণ',
    assetMilestoneTimeline: 'মাইলৰ খুঁটি আৰু ক্ষেত্ৰ অডিট সময়ৰেখা',
    assetGramSabhaSignoff: 'গ্ৰাম সভাৰ অনুমোদন',

    verifyMobileTitle: 'মোবাইল ক্ষেত্ৰ পৰীক্ষণ',
    verifyOfflineHeader: 'অফলাইন-প্ৰথম ক্ষেত্ৰীয় পৰীক্ষা',
    verifySubtitle: 'জিপিএছ স্থানাংক আৰু স্থানীয় সংৰক্ষণৰ সৈতে অভেদ্য ভৌতিক অডিট।',
    verifyRtkFix: 'RTK ফিক্স প্ৰমাণিত (০.৩৮ মিটাৰ)',
    verifyZeroDataLoss: 'শূন্য তথ্য হেৰুৱা প্ৰটোকল',
    verifySyncQueueTitle: 'স্থানীয় সংমিশ্ৰণ তালিকা',
    verifySyncNow: 'এতিয়াই সংমিশ্ৰণ কৰক',
    verifyChecklistTitle: 'ক্ষেত্ৰীয় গুণমান পৰীক্ষা তালিকা',
    verifySubmitButton: 'ক্ষেত্ৰ পৰীক্ষা জমা দিয়ক',

    noticesGazetteHeader: 'চৰকাৰী অসম ৰাজপত্ৰ জাননীসমূহ',
    noticesTitle: 'সংবিধিবদ্ধ জাননী আৰু আঁচনিৰ আপডেট',
    noticesSubtitle: 'কৰ্তৃত্বশীল প্ৰশাসনিক আদেশ, পুঁজি স্থগিতকৰণ নিৰ্দেশনা আৰু সামাজিক অডিট জাননী।',
    noticesSearchPlaceholder: 'জাননী, আদেশ, আঁচনিৰ নাম সন্ধান কৰক...',
    noticesAll: 'সকলো',
    noticesActive: 'সক্ৰিয়',
    noticesAmended: 'সংশোধিত',
    noticesSuperseded: 'প্ৰতিস্থাপিত',
    noticesKeyTakeaways: 'সহায় সাৰাংশ: মুখ্য বিষয়সমূহ',
    noticesVerificationSeal: 'চৰকাৰী অসম ৰাজপত্ৰ ছীল প্ৰমাণিত',
    noticesDownloadPdf: 'চৰকাৰী জাননী ডাউনলোড কৰক (PDF)',

    eligibilityBadge: 'সংবিধিবদ্ধ সুবিধা নিৰ্ণায়ক',
    eligibilityHeading: 'আপুনি লাভ কৰিব পৰা জনকল্যাণমূলক আঁচনিসমূহ বিচাৰি লওক।',
    eligibilitySubheading: '৩টা দ্ৰুত প্ৰশ্নৰ উত্তৰ দিয়ক। চৰকাৰী গেজেটৰ নিয়মাৱলীৰ সৈতে পৰীক্ষা কৰি আপোনাৰ যোগ্যতা নিৰূপণ কৰা হ’ব।',
    eligibilityStep1: '০১ পৰিচয় আৰু জীৱিকা',
    eligibilityStep2: '০২ স্থান আৰু প্ৰয়োজনীয়তা',
    eligibilityStep3: '০৩ উপযুক্ত আঁচনিসমূহ',
    eligibilitySelectDistrict: '১. প্ৰশাসনিক জিলা আৰু অঞ্চল',
    eligibilitySelectArea: '২. বাসস্থান আৰু নদীৰ অৱস্থান',
    eligibilitySelectSector: '৩. মুখ্য প্ৰয়োজনীয়তা বা সুবিধা',
    eligibilityMatchedCount: 'আপোনাৰ বাবে উপযুক্ত আঁচনিসমূহ',

    dirBadge: 'ব্ৰহ্মপুত্ৰ উপত্যকা মাল্টি-মডেল মেছ',
    dirHeading: 'উমৈহতীয়া যাতায়াত আৰু নাগৰিক কেন্দ্ৰ বিচাৰক।',
    dirSubtitle: 'ফেৰী সূচী, গ্ৰাম্য ইভি বাহন, উন্নয়ন খণ্ড কাৰ্যালয় আৰু অফলাইন পৰীক্ষণ কেন্দ্ৰসমূহ।',
    dirSearchPlaceholder: 'পথ, ফেৰী ঘাট, খণ্ড কাৰ্যালয় বা কেন্দ্ৰ সন্ধান কৰক...',
    dirAllHubs: 'সকলো কেন্দ্ৰ (৪২)',
    dirRiverineFerries: 'নদীৰ ফেৰীসমূহ',
    dirEvMicroFeeder: 'ইভি মাইক্ৰ’-ফিডাৰ',
    dirKiosksHubs: 'সেৱা কেন্দ্ৰসমূহ',
    dirActiveServices: 'সক্ৰিয় নাগৰিক সেৱাসমূহ',
    dirWaterway: 'জলপথ',
    dirViewTrack: 'প্ৰত্যক্ষ স্থিতি চাওক',

    insightsBadge: 'তথ্য আৰু বিসংগতি বিশ্লেষণ',
    insightsHeading: 'ব্যাখ্যামূলক বুদ্ধিমত্তা আৰু অডিট বিশ্লেষণ',
    insightsSubtitle: 'বাজেটৰ তাৰতম্য, স্থগিত কাম আৰু জিলাৰ কাৰ্য্যক্ষমতাৰ স্পষ্ট ব্যাখ্যা।',
    insightsZeroBlackBox: 'সম্পূৰ্ণ স্বচ্ছ গণনা পদ্ধতি',
    insightsCard1Title: 'সমন্বিত লেনদেনৰ শুদ্ধতা',
    insightsCard1Val: '৯৯.২%',
    insightsCard1Sub: 'টেলিমেট্ৰি সংগতিপূৰ্ণ',
    insightsCard1Desc: '১,৮৪০ টা কামত শূন্য বিসংগতিৰে ₹১,৪২০ কোটি সমন্বয় সাধন।',
    insightsCard2Title: 'মাল্টি-স্পেকট্ৰেল ভূমি বিচ্যুতি',
    insightsCard2Val: '৪.৮%',
    insightsCard2Sub: 'উপগ্ৰহ ভিত্তিক তাৰতম্য',
    insightsCard2Desc: 'সকলো উপগ্ৰহ নিৰীক্ষণত শূন্য ভুৱা প্ৰকল্প চিহ্নিত।',
    insightsCard3Title: 'পঞ্চায়ত বিসংগতি ঘনত্ব',
    insightsCard3Val: '১.২%',
    insightsCard3Sub: '২৮টা কাম তদন্তাধীন',
    insightsCard3Desc: 'সংশ্লিষ্ট উপায়ুক্তসকললৈ স্বয়ংক্ৰিয়ভাৱে প্ৰেৰিত।',
    insightsActiveTriggers: 'সক্ৰিয় বিসংগতি সংকেত',
    insightsExplainReasoning: 'কাৰণভিত্তিক ব্যাখ্যা আৰু যুক্তি',
    insightsStatutoryAction: 'বাধ্যতামূলক প্ৰশাসনিক ব্যৱস্থা',

    sahayWelcome: 'নমস্কাৰ! মই সহায় এআই (Sahay AI)। অসমৰ উন্নয়নমূলক আঁচনি, চিপাঝাৰ খোৱাপানী প্ৰকল্প বা অভিযোগ দাখিল সম্পৰ্কে সোধক।',
    sahayCopilotSubtitle: 'বহুভাষিক নাগৰিক আৰু আঁচনি সহায়িকা',
    sahayInputPlaceholder: 'সহায় এআইক যিকোনো ভাষাত সোধক...',
    sahayConsulting: 'সংবিধিবদ্ধ তথ্যকোষ পৰীক্ষা কৰা হৈছে...',

    footerStatutoryLedger: 'অসম চৰকাৰ আৰু উত্তৰ-পূব অঞ্চলৰ বাবে সংবিধিবদ্ধ বিকেন্দ্ৰীভূত পৰিকল্পনা আৰু ভৌতিক-বিত্তীয় সত্যতা নিৰূপণ লেজাৰ।',
    footerCoreScreens: 'মূল পৃষ্ঠাসমূহ',
    footerCivicChannels: 'নাগৰিক চেনেলসমূহ',
    footerIntegrity: 'সত্যতা আৰু নীতি পালন',
    footerCopyright: 'দৃষ্টি (Drishti)। মুক্ত সংবিধিবদ্ধ ৰাজহুৱা লেজাৰ।',
    footerZeroSlop: 'দৃষ্টি মানদণ্ড • উচ্চমানৰ নিৰ্ভুল আন্তঃপৃষ্ঠ',
  },

  hi: {
    portalTitle: 'दृष्टि — असम विकेंद्रीकृत योजना एवं सामाजिक लेखापरीक्षा मंच',
    portalSubtitle: 'राज्य स्तरीय भौतिक-वित्तीय समाधान और वैधानिक सामाजिक लेखापरीक्षा बहीखाता',
    skipToContent: 'मुख्य सामग्री पर जाएं',
    helpline: 'टोल-फ्री हेल्पलाइन 1905 (असम आरटीपीएस)',
    prototypeBanner: 'GIGW 3.0 अनुरूप पोर्टल • वैधानिक विकेंद्रीकृत योजना प्रणाली',
    prototypeDisclosure: 'ई-प्रस्तुति, NESIDS और DoNER कोषागार लेजर से दैनिक अद्यतन',
    searchPlaceholder: 'योजना कोड, जिला (उदा. दरंग), सह-जिला या पंचायत खोजें...',
    searchButton: 'खोजें',
    heroHeadline: 'विकेंद्रीकृत योजना। पूर्ण जमीनी सच्चाई।',
    heroSubheadline: 'जियो-टैग्ड ऑन-साइट निष्पादन के विरुद्ध वित्तीय स्वीकृतियों का वास्तविक समय समाधान। असम के 35 जिलों और 78 सह-जिलों को सशक्त बनाना।',
    workflowsHeading: 'वैधानिक सत्यापन कार्यप्रवाह',
    workflowsSubheading: 'असम पीआर अधिनियम की धारा 14(2) और GIGW 3.0 नियमों को लागू करने हेतु निर्मित',
    trackSanction: 'स्वीकृति एवं अनुमोदन ट्रैक करें',
    coDistrictGis: 'सह-जिला जीआईएस नक्शा',
    reconcileFunds: 'धन और भौतिक कार्य का मिलान',
    fieldInspection: 'क्षेत्र अधिकारी निरीक्षण',
    worksiteQr: 'कार्यस्थल क्यूआर पट्टिका',
    publicGrievance: 'सार्वजनिक शिकायत (RTPS)',
    telemetryTitle: 'सार्वजनिक निगरानी टेलीमेट्री',
    totalSchemes: 'कुल स्वीकृत योजनाएं',
    geoTaggedAudits: 'जियो-टैग्ड साइट निरीक्षण',
    reconciledRatio: 'सत्यापित कार्य अनुपात',
    activeVariances: 'सक्रिय विसंगति चेतावनी',
    spotlightTitle: 'नागरिक ऑडिट स्पॉटलाइट',
    spotlightSubtitle: 'कोषागार व्यय बनाम प्राथमिक क्षेत्रों में जमीनी प्रगति की स्पष्ट तुलना।',
    financialDisbursed: 'वितरित धनराशि',
    physicalVerified: 'सत्यापित भौतिक कार्य',
    evidenceScore: 'साक्ष्य स्कोर',
    viewQrCard: 'सार्वजनिक क्यूआर ऑडिट कार्ड देखें',
    sahayTitle: 'सहाय AI (Sahay AI)',
    sahayDisclaimer: 'एआई सहायक • कोई आधिकारिक सरकारी आदेश नहीं',
    askSahayPlaceholder: 'हिंदी, असमिया, अंग्रेजी या बंगाली में पूछें...',
    voiceSupported: 'आवाज खोज समर्थित',
    readAloud: 'हिंदी/असमिया में सुनें',
    footerTagline: 'असम सरकार, योजना और विकास विभाग। ग्राम पंचायतों और स्वायत्त परिषदों के लिए रीयल-टाइम ऑडिट।',
    navOverview: 'अवलोकन',
    navSchemes: 'योजनाएं एवं कार्य',
    navReconciliation: 'समाधान लेजर',
    navMap: 'जीआईएस नक्शा',
    navNotices: 'सूचनाएं',
    navGrievances: 'शिकायतें',
    navFieldVerify: 'सत्यापन',
    navDashboard: 'डैशबोर्ड',
    navSignIn: 'लॉग इन',
    navSignOut: 'लॉग आउट',
    navRegister: 'पंजीकरण',
    navAccessibility: 'पहुंच',
    navPolicies: 'नीतियां एवं गोपनीयता',
    highContrast: 'उच्च कंट्रास्ट मोड',
    themeToggle: 'थीम बदलें',
    textSize: 'फ़ॉन्ट आकार',
    filterAll: 'सभी श्रेणियां',
    filterSchemes: 'योजनाएं और अनुदान',
    filterCoDistricts: 'सह-जिले (78)',
    filterNotices: 'परिपत्र और सूचनाएं',
    filterWorkId: 'कार्य आईडी',
    noResultsFound: 'आपके मानदंडों से मेल खाने वाले कोई रिकॉर्ड नहीं मिले।',
    trySearchingSuggestions: 'खोजने का प्रयास करें: सिपाझार, AS-DAR-0821, बोगीबील, कोकराझार, या NESIDS।',
    schemeRegistry: 'समेकित 11-योजना रजिस्ट्री',
    financialVsPhysical: 'वित्तीय बनाम भौतिक प्रगति लेजर',
    tabAllWorks: 'सभी कार्य',
    tabVariance: 'विसंगति अलर्ट (≥20%)',
    tabStalled: 'रुकी हुई परियोजनाएं (≥60 दिन)',
    tabPendingUc: 'लंबित उपयोगिता प्रमाण पत्र (UC)',
    tabDuplicate: 'संदिग्ध डुप्लीकेट दावे',
    adcEquityLens: 'छठी अनुसूची समानता फ़िल्टर',
    exportCsv: 'सीएसवी निर्यात',
    statusOnTrack: 'प्रगति पर',
    statusStalled: 'रुका हुआ',
    statusVariance: 'विसंगति चिह्नित',
    statusCompleted: 'पूर्ण',
    mapTitle: 'सह-जिला जीआईएस स्थानिक ऑडिट नक्शा',
    mapSubtitle: '35 जिलों, 78 सह-जिलों और स्वायत्त परिषदों में भौगोलिक वितरण।',
    heatmapToggle: 'जिला जोखिम हीटमैप',
    tableFallbackTitle: 'सुलभ परियोजना सूची (स्क्रीन-रीडर अनुकूल)',
    publicAuditDossier: 'सार्वजनिक पारदर्शिता एवं क्यूआर ऑडिट डोजियर',
    statutoryMilestones: 'भौतिक मील के पत्थर एवं निरीक्षण समयरेखा',
    intelligenceBreakdown: 'व्याख्यात्मक बुद्धिमत्ता एवं जोखिम चेतावनी',
    geoTaggedPhotos: 'जियो-टैग्ड कार्य तस्वीरें',
    fileGrievanceForAsset: 'इस कार्य के लिए शिकायत दर्ज करें',
    fileGrievanceTitle: 'नागरिक शिकायत निवारण (असम आरटीपीएस अधिनियम 2012)',
    trackGrievanceTitle: 'शिकायत की स्थिति जांचें',
    ticketCode: 'टिकट कोड',
    applicantName: 'आवेदक का नाम',
    applicantPhone: 'मोबाइल नंबर',
    department: 'विभाग',
    district: 'जिला / सह-जिला',
    grievanceDescription: 'रुके हुए कार्य या गुणवत्ता विसंगति का विस्तृत विवरण',
    submitButton: 'वैधानिक शिकायत दर्ज करें',
    draftSavedMessage: 'प्रारूप आपके उपकरण पर सुरक्षित रूप से सहेजा गया।',
    rtpsSlaNotice: 'असम लोक सेवा अधिकार अधिनियम 2012 के तहत अनिवार्य 15-दिवसीय समाधान अवधि।',
    dashboardTitle: 'व्यक्तिगत कार्यक्षेत्र',
    weeklyExceptionsQueue: 'साप्ताहिक अपवाद समीक्षा सूची (डीसी)',
    myDrafts: 'अपूर्ण ऑफ़लाइन ड्राफ्ट',
    savedSchemes: 'सहेजी गई योजनाएं',
    inspectionQueue: 'फील्ड निरीक्षण कार्य सूची',
    freezeFundingAction: 'कार्य रोको नोटिस जारी करें (धारा 14(2))',

    navLedger: 'बहीखाता',
    navVerify: 'सत्यापन',
    navEligibility: 'पात्रता',
    navDirectory: 'निर्देशिका',
    navInsights: 'विश्लेषण',
    navLiveAudit: 'लाइव ऑडिट',
    perspectiveLabel: 'दृष्टिकोण:',
    citizenRole: 'नागरिक',
    officerRole: 'क्षेत्र अधिकारी',
    dcRole: 'लेखापरीक्षक / डीसी',

    a11yTitle: 'पहुंच विकल्प',
    a11yTextSize: 'पाठ का आकार',
    a11yHighContrast: 'उच्च कंट्रास्ट',
    a11yEnhancedSpacing: 'उन्नत रिक्ति',
    a11yUnderlineLinks: 'लिंक रेखांकन',
    a11yReduceMotion: 'गति कम करें',
    a11yResetAll: 'सभी रीसेट करें',
    a11yWcag: 'WCAG 2.2 AA अनुरूप',

    heroBadge: 'वास्तविक समय सार्वजनिक अवसंरचना बहीखाता',
    heroTitle1: 'हर सार्वजनिक वादे को ट्रैक करें,',
    heroTitle2: 'स्वीकृति से जमीन तक।',
    heroSubtitle: 'असम का संप्रभु भौतिक-वित्तीय समाधान बहीखाता। उपग्रह सत्यापन, ऑफलाइन मेश ऑडिट और हर नागरिक के लिए बहुभाषी बुद्धिमत्ता।',
    heroExploreBtn: 'ऑडिट लेजर देखें',
    heroVerifyBtn: 'क्षेत्र सत्यापन',
    heroFloater1Tag: 'ब्रह्मपुत्र बेसिन',
    heroFloater1Title: 'माजुली तटबंध सुदृढ़ीकरण',
    heroFloater1Status: '₹48.2 करोड़ • 84% पूर्ण',
    heroFloater2Tag: 'नवीनतम फील्ड ऑडिट',
    heroFloater2Title: 'जोरहाट सामुदायिक प्राथमिक स्वास्थ्य केंद्र',
    heroFloater2Status: 'ग्राम सभा #14 द्वारा सत्यापित',
    kpiHeading: '15 कैनोनिकल कार्य खुले में सत्यापित।',
    kpiSubtitle: 'ग्राम स्तर पर पूर्ण पारदर्शिता। कोई बंद पीडीएफ रिपोर्ट नहीं, कोई देरी से ऑडिट नहीं।',
    kpi1Val: '40%',
    kpi1Label: 'तेज़ ऑडिट',
    kpi1Sub: 'स्वीकृति से फील्ड प्रेषण तक',
    kpi2Val: '35+',
    kpi2Label: 'जुड़े हुए जिले',
    kpi2Sub: 'धुबरी से तिनसुकिया तक',
    kpi3Val: '99.2%',
    kpi3Label: 'लेजर मिलान',
    kpi3Sub: 'प्रत्यक्ष कोषागार से जियोटैग प्रमाण',
    kpi4Val: '4',
    kpi4Label: 'आधिकारिक भाषाएं',
    kpi4Sub: 'असमिया, बोडो, बंगाली और अंग्रेजी',
    archTitle: 'मुख्य वास्तुकला',
    archGis: 'जीआईएस जियो-टैगिंग',
    archQr: 'क्यूआर सार्वजनिक ऑडिट',
    archMesh: 'ऑफलाइन मेश सिंक',
    archAi: 'सहाय बहुभाषी एआई',
    archApi: 'ओपन लेजर एपीआई',
    processTag: 'दृष्टि कैसे काम करता है',
    processHeading: 'जीवनचक्र के हर कदम पर स्पष्टता।',
    processSubheading: 'कैबिनेट वित्तीय मंजूरी से लेकर जमीनी स्तर पर मिट्टी परीक्षण और ग्राम सभा की मंजूरी तक।',
    phase1Title: 'स्वीकृति और मानचित्रण',
    phase1Desc: 'प्रशासनिक स्वीकृतियां और विभागीय बजट सीधे राज्य कोषागार प्रणाली से प्राप्त किए जाते हैं। दृष्टि स्वचालित रूप से सटीक कैडस्ट्रल जीपीएस निर्देशांक तय करता है।',
    phase1Tag1: 'कोषागार अंतर्ग्रहण API',
    phase1Tag2: 'जीआईएस बहुभुज मानचित्रण',
    phase2Title: 'मिट्टी और फील्ड ऑडिट',
    phase2Desc: 'फील्ड निरीक्षक और स्थानीय ग्राम निगरानी इकाइयां साइट पर क्रिप्टोग्राफिक रूप से हस्ताक्षरित तस्वीरें और जियोटैग टाइमस्टैम्प एकत्र करती हैं।',
    phase2Tag: 'क्यूआर मोबाइल सत्यापन',
    phase3Title: 'सार्वजनिक प्रमाण और अनुमोदन',
    phase3Desc: 'ठेकेदार के मील के पत्थर जारी करने के लिए सार्वजनिक अनुमोदन अनिवार्य है। सहाय एआई के माध्यम से असमिया, बोडो, बंगाली और अंग्रेजी में जानकारी उपलब्ध है।',
    phase3Tag: 'ग्राम सभा सत्यापन',
    closingTag: 'खुली पहुंच नागरिक रजिस्ट्री',
    closingTitle: 'दृष्टि का अन्वेषण शुरू करें।',
    closingDesc: 'मंजूरी खोजें, अपनी पंचायत में सार्वजनिक कार्यों का निरीक्षण करें, या सेकंडों में जियोटैग फील्ड रिपोर्ट सत्यापित करें।',
    closingBtn1: 'सार्वजनिक एक्सप्लोरर खोलें',
    closingBtn2: 'योजना पात्रता जांचें',

    dashOverview: 'राज्य अवसंरचना समाधान अवलोकन',
    dashDisbursementsVsGround: 'उपग्रह और फील्ड टेलीमेट्री के विरुद्ध कोषागार संवितरण का मिलान',
    dashSubtitle: 'असम के सभी 35 जिलों को कवर करने वाला वास्तविक समय भौतिक-वित्तीय बहीखाता।',
    dashExportAudit: 'सत्यापित ऑडिट निर्यात करें',
    dashActiveSchemes: 'सक्रिय योजनाएं',
    dashPhysicalProgress: 'भौतिक प्रगति',
    dashFinancialUtilization: 'वित्तीय उपयोग',
    dashOpenAnomalies: 'सक्रिय विसंगतियां',
    dashInteractiveCartography: 'इंटरैक्टिव जीआईएस कार्टोग्राफी',
    dashLiveTelemetry: 'स्थानिक कैडस्ट्रल पिन के साथ लाइव टेलीमेट्री परत',
    dashReconciliationLedger: 'समाधान बहीखाता',
    dashInventorySubtitle: 'जीपीएस सत्यापन स्थिति के साथ स्वीकृत सार्वजनिक कार्यों की पूरी सूची',

    assetBreadcrumb: 'ऑडिट लेजर पर वापस जाएं',
    assetPrintPlaque: 'पट्टिका प्रिंट करें',
    assetAuditQrPlaque: 'ऑडिट क्यूआर पट्टिका',
    assetVerifiedOnTrack: 'सत्यापित · प्रगति पर',
    assetDronePass: 'ड्रोन ऑर्थोमोसाइक पास · आज सुबह 06:14 बजे',
    assetPolygonGeofenced: 'बहुभुज जियो-फेंस्ड',
    assetPhysicalCompletion: 'भौतिक समापन',
    assetFinancialDisbursed: 'वित्तीय संवितरण',
    assetMilestoneTimeline: 'मील का पत्थर और फील्ड ऑडिट समयरेखा',
    assetGramSabhaSignoff: 'ग्राम सभा अनुमोदन',

    verifyMobileTitle: 'मोबाइल फील्ड सत्यापन',
    verifyOfflineHeader: 'ऑफलाइन-प्रथम फील्ड सत्यापन',
    verifySubtitle: 'जीपीएस निर्देशांक और स्थानीय कतारबद्धता के साथ सुरक्षित भौतिक ऑडिट।',
    verifyRtkFix: 'RTK फिक्स सत्यापित (0.38 मी)',
    verifyZeroDataLoss: 'शून्य डेटा हानि प्रोटोकॉल',
    verifySyncQueueTitle: 'स्थानीय सिंक कतार',
    verifySyncNow: 'अभी सिंक करें',
    verifyChecklistTitle: 'साइट पर गुणवत्ता चेकलिस्ट',
    verifySubmitButton: 'फील्ड सत्यापन जमा करें',

    noticesGazetteHeader: 'आधिकारिक असम राजपत्र परिपत्र',
    noticesTitle: 'वैधानिक परिपत्र एवं योजना अपडेट',
    noticesSubtitle: 'आधिकारिक प्रशासनिक आदेश, निधि स्थगन निर्देश और सार्वजनिक सामाजिक ऑडिट नोटिस।',
    noticesSearchPlaceholder: 'परिपत्र, आदेश, योजना खोजें...',
    noticesAll: 'सभी',
    noticesActive: 'सक्रिय',
    noticesAmended: 'संशोधित',
    noticesSuperseded: 'प्रतिस्थापित',
    noticesKeyTakeaways: 'सहाय सारांश: मुख्य बिंदु',
    noticesVerificationSeal: 'आधिकारिक असम राजपत्र मुहर सत्यापित',
    noticesDownloadPdf: 'आधिकारिक परिपत्र डाउनलोड करें (PDF)',

    eligibilityBadge: 'वैधानिक लाभ निर्धारक',
    eligibilityHeading: 'सार्वजनिक कल्याण, अनुदान और वे योजनाएं खोजें जिनके आप हकदार हैं।',
    eligibilitySubheading: '3 त्वरित प्रश्नों के उत्तर दें। हम सरकारी गजट नियमों के साथ आपकी पात्रता का मिलान करेंगे।',
    eligibilityStep1: '01 प्रोफ़ाइल और आजीविका',
    eligibilityStep2: '02 स्थान और आवश्यकता',
    eligibilityStep3: '03 सुमेलित योजनाएं',
    eligibilitySelectDistrict: '1. प्रशासनिक जिला और इलाका',
    eligibilitySelectArea: '2. आवास और नदी की स्थिति',
    eligibilitySelectSector: '3. प्राथमिक आवश्यकता या सुविधा',
    eligibilityMatchedCount: 'आपके लिए सुमेलित योजनाएं',

    dirBadge: 'ब्रह्मपुत्र घाटी मल्टी-मोडल मेश',
    dirHeading: 'साझा मार्ग और नागरिक केंद्र खोजें।',
    dirSubtitle: 'फेरी समय सारिणी, ग्रामीण ईवी वैन, ब्लॉक विकास कार्यालय और ऑफ़लाइन सत्यापन केंद्र।',
    dirSearchPlaceholder: 'मार्ग, फेरी घाट, ब्लॉक कार्यालय खोजें...',
    dirAllHubs: 'सभी केंद्र (42)',
    dirRiverineFerries: 'नदी फेरी सेवाएं',
    dirEvMicroFeeder: 'ईवी माइक्रो-फीडर',
    dirKiosksHubs: 'सेवा केंद्र',
    dirActiveServices: 'सक्रिय नागरिक सेवाएं',
    dirWaterway: 'जलमार्ग',
    dirViewTrack: 'वास्तविक समय ट्रैक देखें',

    insightsBadge: 'डेटा विश्लेषण और विसंगति पहचान',
    insightsHeading: 'व्याख्यात्मक बुद्धिमत्ता और ऑडिट विश्लेषण',
    insightsSubtitle: 'बजट भिन्नता, रुके हुए कार्य और जिला प्रदर्शन का स्पष्ट विवरण।',
    insightsZeroBlackBox: 'पूर्ण पारदर्शी स्कोरिंग',
    insightsCard1Title: 'समाधान प्रवाह अखंडता',
    insightsCard1Val: '99.2%',
    insightsCard1Sub: 'टेलीमेट्री संरेखित',
    insightsCard1Desc: '1,840 कार्यों में शून्य रुकावट के साथ ₹1,420 करोड़ का मिलान।',
    insightsCard2Title: 'मल्टी-स्पेक्ट्रल भू-अंतर',
    insightsCard2Val: '4.8%',
    insightsCard2Sub: 'उपग्रह आधारित अंतर',
    insightsCard2Desc: 'सभी उपग्रह निरीक्षणों में शून्य फर्जी परियोजनाएं चिह्नित।',
    insightsCard3Title: 'पंचायत विसंगति घनत्व',
    insightsCard3Val: '1.2%',
    insightsCard3Sub: '28 कार्य जांच के अधीन',
    insightsCard3Desc: 'संबंधित उपायुक्तों को स्वचालित रूप से अग्रेषित।',
    insightsActiveTriggers: 'सक्रिय विसंगति ट्रिगर',
    insightsExplainReasoning: 'कारण और तकनीकी विश्लेषण',
    insightsStatutoryAction: 'अनिवार्य वैधानिक कार्रवाई',

    sahayWelcome: 'नमस्ते! मैं सहाय AI (Sahay AI) हूँ। असम विकास योजनाओं, सिपाझार पेयजल परियोजना स्थिति या आरटीपीएस शिकायत के बारे में पूछें।',
    sahayCopilotSubtitle: 'बहुभाषी नागरिक और योजना सहायक',
    sahayInputPlaceholder: 'सहाय एआई से किसी भी भाषा में पूछें...',
    sahayConsulting: 'वैधानिक ज्ञानकोष से परामर्श किया जा रहा है...',

    footerStatutoryLedger: 'असम सरकार और पूर्वोत्तर क्षेत्र के लिए वैधानिक विकेंद्रीकृत योजना और भौतिक-वित्तीय सत्यापन बहीखाता।',
    footerCoreScreens: 'मुख्य पृष्ठ',
    footerCivicChannels: 'नागरिक चैनल',
    footerIntegrity: 'अखंडता और अनुपालन',
    footerCopyright: 'दृष्टि (Drishti)। खुला वैधानिक सार्वजनिक बहीखाता।',
    footerZeroSlop: 'दृष्टि संपादकीय मानक • उच्च-सटीक इंटरफ़ेस',
  },

  bn: {
    portalTitle: 'দৃষ্টি — আসাম বিকেন্দ্রীভূত পরিকল্পনা ও সামাজিক নিরীক্ষা প্ল্যাটফর্ম',
    portalSubtitle: 'রাজ্য স্তরের ভৌত-আর্থিক সমন্বয় এবং সংবিধিবদ্ধ সামাজিক নিরীক্ষা খতিয়ান',
    skipToContent: 'মূল বিষয়ে যান',
    helpline: 'টোল-ফ্রি হেল্পলাইন ১৯০৫ (আসাম আরটিপিএস)',
    prototypeBanner: 'GIGW ৩.০ সম্মত পোর্টাল • সংবিধিবদ্ধ বিকেন্দ্রীভূত পরিকল্পনা ব্যবস্থা',
    prototypeDisclosure: 'ই-প্রস্তুতি, NESIDS এবং DoNER কোষাগার থেকে দৈনিক নবীকৃত',
    searchPlaceholder: 'স্কিম কোড, জেলা (যেমন দরং), উপ-জেলা বা পঞ্চায়েত অনুসন্ধান করুন...',
    searchButton: 'অনুসন্ধান',
    heroHeadline: 'বিকেন্দ্রীভূত পরিকল্পনা। সম্পূর্ণ বাস্তব সত্যতা।',
    heroSubheadline: 'জিও-ট্যাগযুক্ত কাজের বিপরীতে আর্থিক মঞ্জুরির রিয়েল-টাইম সমন্বয়। আসামের ৩৫টি জেলা ও ৭৮টি উপ-জেলাকে ক্ষমতায়ন।',
    workflowsHeading: 'সংবিধিবদ্ধ যাচাইকরণ প্রক্রিয়া',
    workflowsSubheading: 'আসাম পিআর আইনের ধারা ১৪(২) এবং GIGW ৩.০ নিয়মাবলী কার্যকর করার জন্য নির্মিত',
    trackSanction: 'মঞ্জুরি ও অনুমোদন ট্র্যাকিং',
    coDistrictGis: 'উপ-জেলা জিআইএস মানচিত্র',
    reconcileFunds: 'তহবিল সমন্বয়',
    fieldInspection: 'ফিল্ড পরিদর্শন',
    worksiteQr: 'সাইট কিউআর কার্ড',
    publicGrievance: 'জনঅভিযোগ (RTPS)',
    telemetryTitle: 'পাবলিক নজরদারি টেলিমেট্রি',
    totalSchemes: 'মোট অনুমোদিত প্রকল্প',
    geoTaggedAudits: 'জিও-ট্যাগযুক্ত পরিদর্শন',
    reconciledRatio: 'যাচাইকৃত কাজের হার',
    activeVariances: 'সক্রিয় অসঙ্গতি সতর্কতা',
    spotlightTitle: 'নাগরিক অডিট স্পটলাইট',
    spotlightSubtitle: 'ট্রেজারি থেকে ব্যয় এবং মাঠপর্যায়ের বাস্তব অগ্রগতির স্পষ্ট তুলনা।',
    financialDisbursed: 'বিতরণকৃত অর্থ',
    physicalVerified: 'যাচাইকৃত বাস্তব কাজ',
    evidenceScore: 'প্রমাণ স্কোর',
    viewQrCard: 'পাবলিক কিউআর অডিট কার্ড দেখুন',
    sahayTitle: 'সহায় AI (Sahay AI)',
    sahayDisclaimer: 'এআই সহায়িকা • কোনো সরকারি আদেশ নয়',
    askSahayPlaceholder: 'বাংলা, অসমীয়া, ইংরেজি বা হিন্দিতে জিজ্ঞাসা করুন...',
    voiceSupported: 'ভয়েস অনুসন্ধান সমর্থিত',
    readAloud: 'বাংলা/অসমীয়ায় শুনুন',
    footerTagline: 'আসাম সরকার, পরিকল্পনা ও উন্নয়ন বিভাগ। গ্রাম পঞ্চায়েত ও স্বায়ত্তশাসিত এলাকার জন্য রিয়েল-টাইম অডিট ব্যবস্থা।',
    navOverview: 'মূল পাতা',
    navSchemes: 'প্রকল্প ও কাজসমূহ',
    navReconciliation: 'তহবিল সমন্বয়',
    navMap: 'জিআইএস মানচিত্র',
    navNotices: 'সরকারি নোটিশ',
    navGrievances: 'অভিযোগ (RTPS)',
    navFieldVerify: 'ফিল্ড পরিদর্শন',
    navDashboard: 'ড্যাশবোর্ড',
    navSignIn: 'লগইন',
    navSignOut: 'লগআউট',
    navRegister: 'নিবন্ধন',
    navAccessibility: 'অভিগম্যতা',
    navPolicies: 'নীতি ও গোপনীয়তা',
    highContrast: 'উচ্চ বৈসাদৃশ্য মোড',
    themeToggle: 'থিম পরিবর্তন',
    textSize: 'হরফের আকার',
    filterAll: 'সকল বিভাগ',
    filterSchemes: 'প্রকল্প ও অনুদান',
    filterCoDistricts: 'উপ-জেলাসমূহ (৭৮)',
    filterNotices: 'বিজ্ঞপ্তি ও পরিপত্র',
    filterWorkId: 'প্রকল্প আইডি',
    noResultsFound: 'কোনো তথ্য পাওয়া যায়নি।',
    trySearchingSuggestions: 'অনুসন্ধান করুন: সিপাহীঝাড়, AS-DAR-0821, বগীবিল, কোকরাঝাড়, বা NESIDS।',
    schemeRegistry: 'একত্রিত ১১টি স্কিম রেজিস্ট্রি',
    financialVsPhysical: 'আর্থিক বনাম শারীরিক অগ্রগতি লেজার',
    tabAllWorks: 'সকল কাজ',
    tabVariance: 'অসঙ্গতি সতর্কতা (≥২০%)',
    tabStalled: 'স্থগিত কাজ (≥৬০ দিন)',
    tabPendingUc: 'বকেয়া ইউসি (UC)',
    tabDuplicate: 'সন্দেহজনক ডুপ্লিকেট',
    adcEquityLens: 'ষষ্ঠ তফসিল সমতা বিশ্লেষণ',
    exportCsv: 'সিএসভি এক্সপোর্ট',
    statusOnTrack: 'চলমান',
    statusStalled: 'স্থগিত',
    statusVariance: 'অসঙ্গতি চিহ্নিত',
    statusCompleted: 'সম্পূর্ণ',
    mapTitle: 'উপ-জেলা জিআইএস স্থানিক অডিট মানচিত্র',
    mapSubtitle: '৩৫টি জেলা, ৭৮টি উপ-জেলা এবং ষষ্ঠ তফসিলভুক্ত অঞ্চলে স্কিমসমূহের ভৌগোলিক বিস্তার।',
    heatmapToggle: 'জেলা ঝুঁকি হিটম্যাপ',
    tableFallbackTitle: 'সুলভ প্রকল্প তালিকা (স্ক্রিন-রিডার সহায়ক)',
    publicAuditDossier: 'পাবলিক স্বচ্ছতা ও কিউআর অডিট ডসিয়ার',
    statutoryMilestones: 'বাস্তব মাইলফলক ও পরিদর্শনের সময়রেখা',
    intelligenceBreakdown: 'ব্যাখ্যামূলক বুদ্ধিমত্তা ও ঝুঁকি বিশ্লেষণ',
    geoTaggedPhotos: 'জিও-ট্যাগযুক্ত কাজের ছবি',
    fileGrievanceForAsset: 'এই কাজের জন্য অভিযোগ দায়ের করুন',
    fileGrievanceTitle: 'নাগরিক অভিযোগ দাখিল (আসাম আরটিপিএস আইন ২০১২)',
    trackGrievanceTitle: 'অভিযোগের স্থিতি পরীক্ষা',
    ticketCode: 'টিকিট কোড',
    applicantName: 'আবেদনকারীর নাম',
    applicantPhone: 'মোবাইল নম্বর',
    department: 'বিভাগ',
    district: 'জেলা / উপ-জেলা',
    grievanceDescription: 'স্থগিত কাজ বা ত্রুটির বিস্তারিত বিবরণ',
    submitButton: 'সংবিধিবদ্ধ অভিযোগ জমা দিন',
    draftSavedMessage: 'খসড়া সফলভাবে ডিভাইসে সংরক্ষিত হয়েছে।',
    rtpsSlaNotice: 'আসাম লোকসেবা অধিকার আইন ২০১২ এর অধীনে ১৫ দিনের সেবা নিশ্চয়তা।',
    dashboardTitle: 'ব্যক্তিগত ড্যাশবোর্ড',
    weeklyExceptionsQueue: 'সাপ্তাহিক ব্যতিক্রম পর্যালোচনা তালিকা (ডিসি)',
    myDrafts: 'অসম্পূর্ণ খসড়াসমূহ',
    savedSchemes: 'সংরক্ষিত স্কিমসমূহ',
    inspectionQueue: 'মাঠ পরিদর্শন কাজের তালিকা',
    freezeFundingAction: 'ধারা ১৪(২) এর অধীনে বিল স্থগিত আদেশ',

    navLedger: 'লেজার',
    navVerify: 'যাচাই',
    navEligibility: 'যোগ্যতা',
    navDirectory: 'ডিরেক্টরি',
    navInsights: 'বিশ্লেষণ',
    navLiveAudit: 'লাইভ অডিট',
    perspectiveLabel: 'দৃষ্টিভঙ্গি:',
    citizenRole: 'নাগরিক',
    officerRole: 'মাঠ কর্মকর্তা',
    dcRole: 'নিরীক্ষক / ডিসি',

    a11yTitle: 'অ্যাক্সেসযোগ্যতা বিকল্প',
    a11yTextSize: 'টেক্সটের আকার',
    a11yHighContrast: 'উচ্চ বৈসাদৃশ্য',
    a11yEnhancedSpacing: 'বর্ধিত ব্যবধান',
    a11yUnderlineLinks: 'লিঙ্ক আন্ডারলাইন',
    a11yReduceMotion: 'গতি হ্রাস',
    a11yResetAll: 'সব রিসেট করুন',
    a11yWcag: 'WCAG ২.২ AA সম্মত',

    heroBadge: 'রিয়েল-টাইম পাবলিক অবকাঠামো লেজার',
    heroTitle1: 'প্রতিটি জনসাধারণের প্রতিশ্রুতি ট্র্যাক করুন,',
    heroTitle2: 'অনুমোদন থেকে মাটি পর্যন্ত।',
    heroSubtitle: 'আসামের সার্বভৌম ভৌত-আর্থিক সমন্বয় লেজার। উপগ্রহ যাচাইকরণ, অফলাইন মেশ অডিট এবং প্রতিটি নাগরিকের জন্য বহুভাষিক বুদ্ধিমত্তা।',
    heroExploreBtn: 'অডিট লেজার দেখুন',
    heroVerifyBtn: 'মাঠ পরিদর্শন',
    heroFloater1Tag: 'ব্রহ্মপুত্র অববাহিকা',
    heroFloater1Title: 'মাজুলি বাঁধ শক্তিবৃদ্ধি',
    heroFloater1Status: '₹৪৮.২ কোটি • ৮৪% সম্পন্ন',
    heroFloater2Tag: 'সাম্প্রতিক মাঠ নিরীক্ষা',
    heroFloater2Title: 'যোরহাট কমিউনিটি প্রাথমিক স্বাস্থ্য কেন্দ্র',
    heroFloater2Status: 'গ্রাম সভা #১৪ দ্বারা যাচাইকৃত',
    kpiHeading: '১২,৪০০+ কাজ প্রকাশ্যে যাচাইকৃত।',
    kpiSubtitle: 'গ্রাম স্তরে সম্পূর্ণ স্বচ্ছতা। কোনো লক করা পিডিএফ রিপোর্ট নেই, কোনো বিলম্বিত অডিট নেই।',
    kpi1Val: '৪০%',
    kpi1Label: 'দ্রুত নিরীক্ষা',
    kpi1Sub: 'অনুমোদন থেকে ফিল্ড প্রেরণ পর্যন্ত',
    kpi2Val: '৩৫+',
    kpi2Label: 'সংযুক্ত জেলাসমূহ',
    kpi2Sub: 'ধুবড়ি থেকে তিনসুকিয়া পর্যন্ত',
    kpi3Val: '৯৯.২%',
    kpi3Label: 'লেজার মিল',
    kpi3Sub: 'সরাসরি ট্রেজারি থেকে জিওট্যাগ প্রমাণ',
    kpi4Val: '৪',
    kpi4Label: 'অফিসিয়াল ভাষাসমূহ',
    kpi4Sub: 'অসমীয়া, বোড়ো, বাংলা এবং ইংরেজি',
    archTitle: 'মূল স্থাপত্য',
    archGis: 'জিআইএস জিও-ট্যাগিং',
    archQr: 'কিউআর পাবলিক অডিট',
    archMesh: 'অফলাইন মেশ সিঙ্ক',
    archAi: 'সহায় বহুভাষিক এআই',
    archApi: 'ওপেন লেজার এপিআই',
    processTag: 'দৃষ্টি কিভাবে কাজ করে',
    processHeading: 'জীবনচক্রের প্রতিটি পদক্ষেপে স্পষ্টতা।',
    processSubheading: 'ক্যাবিনেট আর্থিক অনুমোদন থেকে শুরু করে তৃণমূল স্তরে মাটি পরীক্ষা এবং গ্রাম সভার অনুমোদন পর্যন্ত।',
    phase1Title: 'অনুমোদন এবং মানচিত্রায়ন',
    phase1Desc: 'প্রশাসনিক অনুমোদন এবং বিভাগীয় বাজেট সরাসরি রাজ্য কোষাগার সিস্টেম থেকে গৃহীত হয়। দৃষ্টি স্বয়ংক্রিয়ভাবে সঠিক ক্যাডাস্ট্রাল জিপিএস স্থানাঙ্ক নির্ধারণ করে।',
    phase1Tag1: 'ট্রেজারি গ্রহণ API',
    phase1Tag2: 'জিআইএস বহুভুজ মানচিত্রায়ন',
    phase2Title: 'মাটি এবং মাঠ নিরীক্ষা',
    phase2Desc: 'মাঠ পরিদর্শক এবং স্থানীয় গ্রাম পর্যবেক্ষণ ইউনিটগুলি অন-সাইটে ক্রিপ্টোগ্রাফিকভাবে স্বাক্ষরিত ছবি এবং জিওট্যাগ টাইমস্ট্যাম্প সংগ্রহ করে।',
    phase2Tag: 'কিউআর মোবাইল যাচাই',
    phase3Title: 'পাবলিক প্রমাণ এবং অনুমোদন',
    phase3Desc: 'ঠিকাদারের পরবর্তী তহবিল ছাড়ের জন্য জনসাধারণের অনুমোদন প্রয়োজন। সহায় এআই এর মাধ্যমে অসমীয়া, বোড়ো, বাংলা এবং ইংরেজিতে উন্মুক্ত খতিয়ান উপলব্ধ।',
    phase3Tag: 'গ্রাম সভার প্রত্যয়ন',
    closingTag: 'ওপেন অ্যাক্সেস সিটিজেন রেজিস্ট্রি',
    closingTitle: 'দৃষ্টি অনুসন্ধান শুরু করুন।',
    closingDesc: 'অনুমোদন অনুসন্ধান করুন, আপনার পঞ্চায়েতে জনসাধারণের কাজ পরিদর্শন করুন, অথবা কয়েক সেকেন্ডে জিওট্যাগ করা ফিল্ড রিপোর্ট যাচাই করুন।',
    closingBtn1: 'পাবলিক এক্সপ্লোরার খুলুন',
    closingBtn2: 'স্কিম যোগ্যতা যাচাই করুন',

    dashOverview: 'রাজ্য অবকাঠামো সমন্বয় সারসংক্ষেপ',
    dashDisbursementsVsGround: 'উপগ্রহ ও মাঠপর্যায়ের তথ্যের সাথে কোষাগারের ব্যয়ের মিলন',
    dashSubtitle: 'আসামের ৩৫টি জেলাকে অন্তর্ভুক্ত করে রিয়েল-টাইম ভৌত-আর্থিক লেজার।',
    dashExportAudit: 'যাচাইকৃত অডিট এক্সপোর্ট করুন',
    dashActiveSchemes: 'সক্রিয় প্রকল্পসমূহ',
    dashPhysicalProgress: 'শারীরিক অগ্রগতি',
    dashFinancialUtilization: 'আর্থিক ব্যবহার',
    dashOpenAnomalies: 'সক্রিয় অসঙ্গতি',
    dashInteractiveCartography: 'ইন্টারেক্টিভ জিআইএস মানচিত্রায়ন',
    dashLiveTelemetry: 'ক্যাডাস্ট্রাল পিন সহ লাইভ টেলিমেট্রি লেয়ার',
    dashReconciliationLedger: 'সমন্বয় খতিয়ান',
    dashInventorySubtitle: 'জিপিএস যাচাইকরণ স্থিতি সহ অনুমোদিত পাবলিক কাজের সম্পূর্ণ তালিকা',

    assetBreadcrumb: 'অডিট লেজারে ফিরে যান',
    assetPrintPlaque: 'ফলক প্রিন্ট করুন',
    assetAuditQrPlaque: 'অডিট কিউআর ফলক',
    assetVerifiedOnTrack: 'যাচাইকৃত · চলমান',
    assetDronePass: 'ড্রোন অর্থোমোসাইক পাস · আজ সকাল ০৬:১৪',
    assetPolygonGeofenced: 'বহুভুজ জিও-ফেন্সড',
    assetPhysicalCompletion: 'শারীরিক সমাপ্তি',
    assetFinancialDisbursed: 'আর্থিক বিতরণ',
    assetMilestoneTimeline: 'মাইলফলক ও মাঠপর্যায়ের অডিট সময়রেখা',
    assetGramSabhaSignoff: 'গ্রাম সভার স্বাক্ষর',

    verifyMobileTitle: 'মোবাইল মাঠ যাচাইকরণ',
    verifyOfflineHeader: 'অফলাইন-প্রথম মাঠ যাচাই',
    verifySubtitle: 'জিপিএস স্থানাঙ্ক লক এবং স্থানীয় সংরক্ষণ সহ নির্ভুল ভৌত অডিট।',
    verifyRtkFix: 'RTK ফিক্স যাচাইকৃত (০.৩৮ মি)',
    verifyZeroDataLoss: 'শূন্য ডেটা ক্ষতি প্রটোকল',
    verifySyncQueueTitle: 'স্থানীয় সিঙ্ক সারি',
    verifySyncNow: 'এখনই সিঙ্ক করুন',
    verifyChecklistTitle: 'অন-সাইট মান চেকলিস্ট',
    verifySubmitButton: 'মাঠ যাচাইকরণ জমা দিন',

    noticesGazetteHeader: 'অফিসিয়াল আসাম গেজেট পরিপত্র',
    noticesTitle: 'সংবিধিবদ্ধ পরিপত্র এবং স্কিম আপডেট',
    noticesSubtitle: 'প্রশাসনিক আদেশ, তহবিল স্থগিতের নির্দেশিকা এবং সামাজিক নিরীক্ষা নোটিশ।',
    noticesSearchPlaceholder: 'পরিপত্র, আদেশ, স্কিম অনুসন্ধান করুন...',
    noticesAll: 'সকল',
    noticesActive: 'সক্রিয়',
    noticesAmended: 'সংশোধিত',
    noticesSuperseded: 'প্রতিস্থাপিত',
    noticesKeyTakeaways: 'সহায় নির্বাহী সারাংশ: মূল বিষয়বস্তু',
    noticesVerificationSeal: 'অফিসিয়াল আসাম গেজেট সীলমোহর যাচাইকৃত',
    noticesDownloadPdf: 'অফিসিয়াল নোটিশ ডাউনলোড করুন (PDF)',

    eligibilityBadge: 'সংবিধিবদ্ধ সুবিধা নির্ধারক',
    eligibilityHeading: 'আপনি যে সমস্ত পাবলিক কল্যাণমূলক সুবিধা ও অনুদানের যোগ্য তা সন্ধান করুন।',
    eligibilitySubheading: '৩টি সহজ প্রশ্নের উত্তর দিন। আমরা সরকারি গেজেটের সাথে মিলিয়ে দেখাব আপনি কোন কোন স্কিমের যোগ্য।',
    eligibilityStep1: '০১ প্রোফাইল ও জীবিকা',
    eligibilityStep2: '০২ অবস্থান ও প্রয়োজনীয়তা',
    eligibilityStep3: '০৩ উপযুক্ত স্কিমসমূহ',
    eligibilitySelectDistrict: '১. প্রশাসনিক জেলা ও এলাকা',
    eligibilitySelectArea: '২. বাসস্থান ও নদীর অবস্থান',
    eligibilitySelectSector: '৩. প্রাথমিক কল্যাণ বা পরিকাঠামোর চাহিদা',
    eligibilityMatchedCount: 'আপনার জন্য উপযুক্ত স্কিম',

    dirBadge: 'ব্রহ্মপুত্র ভ্যালি মাল্টি-মোডাল সংযোগ',
    dirHeading: 'সাধারণ যাতায়াত রুট এবং নাগরিক কেন্দ্র খুঁজুন।',
    dirSubtitle: 'নদীর ফেরি সূচি, গ্রামীণ ইভি ভ্যান, ব্লক অফিস এবং অফলাইন যাচাইকরণ কেন্দ্রসমূহ।',
    dirSearchPlaceholder: 'রুট, ফেরি ঘাট, ব্লক অফিস অনুসন্ধান করুন...',
    dirAllHubs: 'সকল কেন্দ্র (৪২)',
    dirRiverineFerries: 'নদীর ফেরীসমূহ',
    dirEvMicroFeeder: 'ইভি মাইক্রো-ফিডার',
    dirKiosksHubs: 'সেবা কেন্দ্রসমূহ',
    dirActiveServices: 'সক্রিয় নাগরিক সেবা',
    dirWaterway: 'জলপথ',
    dirViewTrack: 'রিয়েল-টাইম ট্র্যাক দেখুন',

    insightsBadge: 'উপাত্ত বিশ্লেষণ ও অসঙ্গতি চিহ্নিতকরণ',
    insightsHeading: 'ব্যাখ্যামূলক বুদ্ধিমত্তা ও অডিট অন্তর্দৃষ্টি',
    insightsSubtitle: 'বাজেট পার্থক্য, স্থগিত কাজ এবং জেলার পারফরম্যান্সের সুস্পষ্ট ব্যাখ্যা।',
    insightsZeroBlackBox: 'সম্পূর্ণ উন্মুক্ত গণনা পদ্ধতি',
    insightsCard1Title: 'সমন্বিত লেনদেনের শুদ্ধতা',
    insightsCard1Val: '৯৯.২%',
    insightsCard1Sub: 'টেলিমেট্রি সঙ্গতিপূর্ণ',
    insightsCard1Desc: '১,৮৪০টি কাজে শূন্য অসঙ্গতি সহ ₹১,৪২০ কোটি সমন্বয়।',
    insightsCard2Title: 'মাল্টি-স্পেকট্রাল ভূমি বিচ্যুতি',
    insightsCard2Val: '৪.৮%',
    insightsCard2Sub: 'উপগ্রহ ভিত্তিক বিচ্যুতি',
    insightsCard2Desc: 'সব উপগ্রহ নিরীক্ষণে শূন্য ভুয়া প্রকল্প চিহ্নিত।',
    insightsCard3Title: 'পঞ্চায়েত অসঙ্গতি ঘনত্ব',
    insightsCard3Val: '১.২%',
    insightsCard3Sub: '২৮টি কাজ তদন্তাধীন',
    insightsCard3Desc: 'সংশ্লিষ্ট জেলা প্রশাসকদের নিকট স্বয়ংক্রিয়ভাবে প্রেরিত।',
    insightsActiveTriggers: 'সক্রিয় অসঙ্গতি ট্রিগার',
    insightsExplainReasoning: 'কারণভিত্তিক ব্যাখ্যা ও যুক্তি',
    insightsStatutoryAction: 'বাধ্যতামূলক সংবিধিবদ্ধ পদক্ষেপ',

    sahayWelcome: 'নমস্কার! আমি সহায় এআই (Sahay AI)। অসমের বিভিন্ন উন্নয়ন প্রকল্প ও সিপাহীঝাড় পানীয় জল প্রকল্প সম্পর্কে অনুসন্ধান করুন।',
    sahayCopilotSubtitle: 'বহুভাষিক নাগরিক ও স্কিম সহকারী',
    sahayInputPlaceholder: 'সহায় এআই-কে যেকোনো ভাষায় জিজ্ঞাসা করুন...',
    sahayConsulting: 'সংবিধিবদ্ধ তথ্যকোষ থেকে অনুসন্ধান করা হচ্ছে...',

    footerStatutoryLedger: 'আসাম সরকার এবং উত্তর-পূর্ব অঞ্চলের জন্য সংবিধিবদ্ধ বিকেন্দ্রীভূত পরিকল্পনা ও ভৌত-আর্থিক যাচাইকরণ খতিয়ান।',
    footerCoreScreens: 'প্রধান পাতাসমূহ',
    footerCivicChannels: 'নাগরিক মাধ্যম',
    footerIntegrity: 'সততা ও নিয়মানুবর্তিতা',
    footerCopyright: 'দৃষ্টি (Drishti)। উন্মুক্ত সংবিধিবদ্ধ পাবলিক লেজার।',
    footerZeroSlop: 'দৃষ্টি মানদণ্ড • উচ্চমানের নির্ভুল ইন্টারফেস',
  },
};
