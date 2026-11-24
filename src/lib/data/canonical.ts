/**
 * Drishti (দৃষ্টি) — Canonical Assam Schemes, Projects & Event Ledger
 * Comprehensive, resilient seed & fallback dataset covering all 11 schemes,
 * 35 territorial districts, co-districts, Sixth Schedule ADCs, and the flagship
 * NESIDS-OTRI Sipajhar demo scenario.
 */

export interface CanonicalProject {
  id: string;
  workCode: string;
  title: string;
  scheme: string;
  fundingAgency: string;
  sanctionDate: string;
  sanctionedCost: number;
  revisedCost?: number | null;
  state: string;
  district: string;
  coDistrict: string;
  block: string;
  adcArea?: 'BTC' | 'KAAC' | 'NCHAC' | null;
  governanceType: 'SIXTH_SCHEDULE_ADC' | 'PANCHAYAT_GRAM_SABHA';
  villageWard: string;
  latitude: number;
  longitude: number;
  implementingAgency: string;
  contractor?: string | null;
  executingOfficer: string;
  technicalSanctionRef?: string | null;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  physicalCompletionPct: number;
  financialSanction: number;
  fundReleased: number;
  expenditure: number;
  ucStatus: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'NOT_APPLICABLE';
  pendingAmount: number;
  pendingUcAgeDays: number;
  lastInspectionDate: string;
  daysSinceLastInspection: number;
  outcomeIndicators: {
    beneficiaries?: number;
    households?: number;
    waterConnections?: number;
    roadKm?: number;
    classrooms?: number;
    beds?: number;
    jobsCreated?: number;
    solarCapacityKw?: number;
  };
  imagePath: string;
  status: 'PLANNED' | 'ONGOING' | 'STALLED' | 'COMPLETED' | 'CLOSED';
  stalledAlert?: boolean;
  mismatchAlert?: boolean;
  delayRiskScore: number; // 0-100
  evidenceScore: number;  // 0-100
  milestones: {
    id: string;
    name: string;
    plannedDate: string;
    actualDate?: string | null;
    completionPct: number;
    verified: boolean;
    verifiedBy?: string | null;
    notes?: string | null;
  }[];
  inspections: {
    id: string;
    officerName: string;
    gpsLat: number;
    gpsLng: number;
    date: string;
    photoPath: string;
    notes: string;
    flags: Record<string, boolean>;
  }[];
  grievancesCount: number;
}

export interface CanonicalScheme {
  code: string;
  name: string;
  shortName: string;
  category: 'CENTRAL_SECTOR' | 'STATE_PLAN' | 'SPECIAL_PACKAGE' | 'LOCAL_AREA' | 'NATIONAL_FLAGSHIP';
  fundingPattern: string;
  statutoryAgency: string;
  description: string;
  mandateHighlights: string;
  activeProjectsCount: number;
}

export interface CanonicalNotice {
  id: string;
  title: string;
  issuingAuthority: string;
  publishedAt: string;
  effectiveAt?: string;
  status: 'ACTIVE' | 'AMENDED' | 'SUPERSEDED' | 'EXPIRED';
  originalText: string;
  plainSummary: string;
  actionChecklist: string[];
  sourceUrl?: string;
  department: string;
  district: string;
  year: number;
  documentType: 'GAZETTE_ORDER' | 'SANCTION_MANDATE' | 'STOP_WORK_NOTICE' | 'PUBLIC_HEARING';
  translations: Record<'en' | 'as' | 'hi' | 'bn', string>;
  imagePath?: string;
}

export interface CanonicalEvent {
  id: string;
  timestamp: string;
  type: 'FIELD' | 'FINANCIAL' | 'ADMINISTRATIVE' | 'CITIZEN' | 'SYSTEM';
  title: string;
  description: string;
  actor: string;
  projectWorkCode?: string;
  district: string;
  coDistrict?: string;
  badge?: string;
  severity?: 'NORMAL' | 'WARNING' | 'ALERT' | 'SUCCESS';
}

export interface CanonicalGrievance {
  id: string;
  ticketCode: string;
  projectWorkCode: string;
  category: 'STALLED_WORK' | 'QUALITY_DEFECT' | 'FUND_MISUSE' | 'WATER_SUPPLY_HALT' | 'CORRUPTION_ALLEGATION' | 'DOCUMENT_REQUEST' | 'OFFICER_CONDUCT' | 'OTHER';
  department: string;
  district: string;
  coDistrict: string;
  description: string;
  citizenName: string;
  contactNumber: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  timeline: { status: string; date: string; note: string; officer?: string }[];
  feedbackRating?: number;
}

// =========================================================================
// 1. ALL 11 SCHEMES REGISTRY
// =========================================================================
export const CANONICAL_SCHEMES: CanonicalScheme[] = [
  {
    code: 'NESIDS_ROADS',
    name: 'North East Special Infrastructure Development Scheme (Roads)',
    shortName: 'NESIDS-Roads',
    category: 'CENTRAL_SECTOR',
    fundingPattern: '100% Central Sector Grant',
    statutoryAgency: 'Ministry of DoNER & Assam PWRD',
    description: 'Strategic road and bridge connectivity connecting remote rural economic nodes to arterial state highways.',
    mandateHighlights: 'Enhances economic mobility, flood-resilient embankments, and all-weather inter-district access.',
    activeProjectsCount: 142,
  },
  {
    code: 'NESIDS_OTRI',
    name: 'North East Special Infrastructure Development Scheme (Other Than Road Infrastructure)',
    shortName: 'NESIDS-OTRI',
    category: 'CENTRAL_SECTOR',
    fundingPattern: '100% Central Sector Grant',
    statutoryAgency: 'Ministry of DoNER & Assam PHED',
    description: 'Core piped water supply, surface water treatment plants, water security grids, and community health centers.',
    mandateHighlights: 'Mandatory physical-financial reconciliation before release of 3rd and final tranche. Subject to Section 14(2) stop-work rules.',
    activeProjectsCount: 98,
  },
  {
    code: 'NEC',
    name: 'North Eastern Council Development Schemes',
    shortName: 'NEC Schemes',
    category: 'CENTRAL_SECTOR',
    fundingPattern: '100% Central Sector (NEC Earmark)',
    statutoryAgency: 'North Eastern Council (Shillong) & Line Depts',
    description: 'Regional development initiatives across horticulture, animal husbandry, agricultural logistics, and transit corridors.',
    mandateHighlights: 'Strict statutory earmark: minimum 30% allocation reserved for economically deprived and border habitations.',
    activeProjectsCount: 76,
  },
  {
    code: 'PM_DEVINE',
    name: "Prime Minister's Development Initiative for North-East",
    shortName: 'PM-DevINE',
    category: 'CENTRAL_SECTOR',
    fundingPattern: '100% Central Sector Funding (Cabinet Outlay)',
    statutoryAgency: 'Ministry of DoNER & NEC',
    description: 'High-impact social development infrastructure, youth livelihood parks, and agro-processing hubs (2022–2026).',
    mandateHighlights: '₹6,600 Crore multi-year outlay focusing on verifiable beneficiary outcomes rather than brick-and-mortar expenditure.',
    activeProjectsCount: 52,
  },
  {
    code: 'SDP',
    name: 'Special Development Packages (Bodoland & Hill Councils)',
    shortName: 'Special Development Packages (SDP)',
    category: 'SPECIAL_PACKAGE',
    fundingPattern: 'Central Special Assistance + State Share (90:10)',
    statutoryAgency: 'Sixth Schedule Autonomous Councils (BTC / KAAC / NCHAC)',
    description: 'Dedicated socio-economic upliftment, flood shelters, and civic infrastructure in Sixth Schedule autonomous council territories.',
    mandateHighlights: 'Autonomous council governance oversight with dual verification by District Commissioner and Council Executive Members.',
    activeProjectsCount: 64,
  },
  {
    code: 'MLAADS',
    name: 'Member of Legislative Assembly Area Development Scheme',
    shortName: 'MLAADS',
    category: 'LOCAL_AREA',
    fundingPattern: 'State Budgetary Devolution (₹2.00 Cr / Constituency)',
    statutoryAgency: 'Transformation & Development Department, Assam',
    description: 'Constituency-level public works for community halls, science laboratories, drinking water kiosks, and rural pathways.',
    mandateHighlights: 'Strict citizen public sign-off and Gaon Sabha resolution prerequisite for scheme completion certificates.',
    activeProjectsCount: 184,
  },
  {
    code: 'SUHRID',
    name: 'Suhrid Civic Health & Micro-Infrastructure Support',
    shortName: 'Suhrid',
    category: 'LOCAL_AREA',
    fundingPattern: 'State Plan Devolution',
    statutoryAgency: 'District Administration / Sub-Divisional (Civil)',
    description: 'Emergency civic health clinics, medical sub-center amenities, and targeted public assistance for vulnerable families.',
    mandateHighlights: 'Time-bound processing within 15 days under Assam Right to Public Services Act 2012.',
    activeProjectsCount: 88,
  },
  {
    code: 'UNTIED_FUNDS',
    name: 'Untied Decentralised Planning & Innovation Funds',
    shortName: 'Untied Funds',
    category: 'STATE_PLAN',
    fundingPattern: 'State Plan Discretionary Grants',
    statutoryAgency: 'District Planning Committee (DPC) & Deputy Commissioners',
    description: 'Flexible district-level capital allocations to resolve acute local infrastructure bottlenecks not covered by line departments.',
    mandateHighlights: 'Deputy Commissioner is statutory authority; requires quarterly utilization reconciliation on public portal.',
    activeProjectsCount: 112,
  },
  {
    code: 'ASSAM_DARSHAN',
    name: 'Assam Darshan — Satra & Cultural Heritage Site Preservation',
    shortName: 'Assam Darshan',
    category: 'STATE_PLAN',
    fundingPattern: 'State Plan Capital Grants (₹10 Lakh – ₹2.5 Cr)',
    statutoryAgency: 'Cultural Affairs & Transformation Dept',
    description: 'Preservation of ancient Satras, historic Namghars, archaeological shrines, and visitor approach facilities.',
    mandateHighlights: 'Protects cultural ecology of Assam with transparent milestone disbursement tied to artisanal construction verification.',
    activeProjectsCount: 104,
  },
  {
    code: 'AAGY',
    name: 'Assam Adarsh Gram Yojana (Model Village Initiative)',
    shortName: 'Assam Adarsh Gram Yojana',
    category: 'STATE_PLAN',
    fundingPattern: 'State Plan (₹50 Lakh per Adarsh Village)',
    statutoryAgency: 'Panchayat & Rural Development (P&RD) Dept',
    description: 'Holistic model village development with baseline indicators: solar lighting, piped water, high-speed digital GP library.',
    mandateHighlights: 'Measurable village baseline progression scorecard tracked before secondary release.',
    activeProjectsCount: 72,
  },
  {
    code: 'NATIONAL_JJM_PMGSY_CUSTOM',
    name: 'National Schemes Synergy (JJM, PMGSY, PMAY-G, MGNREGA)',
    shortName: 'National Cross-Scheme Synergy',
    category: 'NATIONAL_FLAGSHIP',
    fundingPattern: 'Central:State Shared (90:10 North East Norm)',
    statutoryAgency: 'Respective State Line Departments & Central Portals',
    description: 'Harmonized tracking of National Flagship schemes operating across Assam, paired with state decentralized schemes.',
    mandateHighlights: 'Eliminates duplicate payments and overlapping geo-polygons between state and national execution agencies.',
    activeProjectsCount: 220,
  },
];

// =========================================================================
// 2. 15 CANONICAL ASSAM PROJECTS (SPANNING ALL 11 SCHEMES & ADCs)
// =========================================================================
export const CANONICAL_PROJECTS: CanonicalProject[] = [
  // Flagship Demo Project: NESIDS-OTRI Sipajhar Water Scheme
  {
    id: 'proj-as-dar-0821',
    workCode: 'AS-DAR-0821',
    title: 'NESIDS-OTRI Rural Piped Water Supply, Sipajhar Cluster Phase-II',
    scheme: 'NESIDS_OTRI',
    fundingAgency: 'Ministry of DoNER',
    sanctionDate: '2024-01-15T00:00:00.000Z',
    sanctionedCost: 11.00,
    revisedCost: 11.00,
    state: 'Assam',
    district: 'Darrang',
    coDistrict: 'Sipajhar',
    block: 'Sipajhar Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Sipajhar Gaon',
    latitude: 26.4352,
    longitude: 91.8841,
    implementingAgency: 'Public Health Engineering Dept (PHED)',
    contractor: 'M/s Brahmaputra Infra-Engg Ltd',
    executingOfficer: 'Pranjal Saikia, AEE PHED Mangaldai',
    technicalSanctionRef: 'TS/PHED/DAR/2024/0821',
    plannedStartDate: '2024-02-01T00:00:00.000Z',
    plannedEndDate: '2025-01-31T00:00:00.000Z',
    actualStartDate: '2024-02-10T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 35.0,
    financialSanction: 11.00,
    fundReleased: 8.80,
    expenditure: 8.80,
    ucStatus: 'PENDING',
    pendingAmount: 2.20,
    pendingUcAgeDays: 142,
    lastInspectionDate: '2026-01-15T10:30:00.000Z',
    daysSinceLastInspection: 74,
    outcomeIndicators: {
      households: 2400,
      waterConnections: 840,
      beneficiaries: 11200,
    },
    imagePath: '/images/015_Student_at_the_exhibition_stalls_of_the_Public_Health_Engineering_Depa.jpg',
    status: 'STALLED',
    stalledAlert: true,
    mismatchAlert: true,
    delayRiskScore: 92,
    evidenceScore: 38,
    grievancesCount: 14,
    milestones: [
      { id: 'm1', name: 'Intake Well Excavation & Foundation', plannedDate: '2024-03-01', actualDate: '2024-05-15', completionPct: 100, verified: true, verifiedBy: 'Pranjal Saikia', notes: 'Foundation completed, excavation abandoned due to strata issues' },
      { id: 'm2', name: 'Water Treatment Plant Civil Works', plannedDate: '2024-05-01', actualDate: '2024-10-30', completionPct: 100, verified: true, verifiedBy: 'Pranjal Saikia', notes: 'Concrete structural shell completed' },
      { id: 'm3', name: 'Pipeline Laying - Phase 1 (Main Trunk)', plannedDate: '2024-08-01', actualDate: null, completionPct: 60, verified: false, notes: 'Stalled at Km 4.2 — contractor demobilized' },
      { id: 'm4', name: 'Pipeline Laying - Phase 2 (Distribution)', plannedDate: '2025-01-01', actualDate: null, completionPct: 0, verified: false, notes: 'Not started — dependent on main trunk' },
      { id: 'm5', name: 'Household Tap Connections & Commissioning', plannedDate: '2025-04-01', actualDate: null, completionPct: 0, verified: false, notes: 'Pending line testing' },
    ],
    inspections: [
      {
        id: 'insp-1',
        officerName: 'Pranjal Saikia, AEE',
        gpsLat: 26.4352,
        gpsLng: 91.8841,
        date: '2026-01-15T10:30:00.000Z',
        photoPath: '/images/015_Student_at_the_exhibition_stalls_of_the_Public_Health_Engineering_Depa.jpg',
        notes: 'Site visit confirmed pipeline laying stalled at Km 4.2. Intake well excavation abandoned since January. High discrepancy with claimed 80% disbursement. Show-cause initiated under Section 14(2).',
        flags: { stalledWork: true, abandonedExcavation: true, contractorAbsent: true },
      },
    ],
  },

  // NESIDS-Roads Majuli
  {
    id: 'proj-as-maj-0301',
    workCode: 'AS-MAJ-0301',
    title: 'Majuli Island Flood Embankment & Brahmaputra Feeder Road',
    scheme: 'NESIDS_ROADS',
    fundingAgency: 'Ministry of DoNER / Assam PWRD',
    sanctionDate: '2023-11-20T00:00:00.000Z',
    sanctionedCost: 18.50,
    revisedCost: 18.50,
    state: 'Assam',
    district: 'Majuli',
    coDistrict: 'Garamur',
    block: 'Ujani Majuli Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Kamalabari Ghat',
    latitude: 26.9632,
    longitude: 94.2144,
    implementingAgency: 'Public Works Roads Department (PWRD)',
    contractor: 'M/s Brahmaputra Valley Infratech',
    executingOfficer: 'Monoj Kumar Das, EE PWRD Majuli',
    technicalSanctionRef: 'TS/PWRD/MAJ/2023/0301',
    plannedStartDate: '2023-12-01T00:00:00.000Z',
    plannedEndDate: '2025-03-31T00:00:00.000Z',
    actualStartDate: '2023-12-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 82.5,
    financialSanction: 18.50,
    fundReleased: 15.00,
    expenditure: 14.80,
    ucStatus: 'VERIFIED',
    pendingAmount: 3.50,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-10T14:20:00.000Z',
    daysSinceLastInspection: 15,
    outcomeIndicators: {
      roadKm: 24.5,
      beneficiaries: 48000,
    },
    imagePath: '/images/009_Majuli_Assam_India_River_Island.jpg',
    status: 'ONGOING',
    delayRiskScore: 24,
    evidenceScore: 88,
    grievancesCount: 2,
    milestones: [
      { id: 'm1', name: 'Sub-grade earthen embankment', plannedDate: '2024-02-01', actualDate: '2024-03-15', completionPct: 100, verified: true },
      { id: 'm2', name: 'Geo-bag slope protection', plannedDate: '2024-06-01', actualDate: '2024-07-20', completionPct: 100, verified: true },
      { id: 'm3', name: 'Bituminous carpet surfacing', plannedDate: '2024-12-01', actualDate: '2025-01-15', completionPct: 75, verified: true },
    ],
    inspections: [],
  },

  // NESIDS-Roads Dhubri
  {
    id: 'proj-as-dhu-0902',
    workCode: 'AS-DHU-0902',
    title: 'Dhubri–Phulbari Bridge Approach Road & River Terminal Infrastructure',
    scheme: 'NESIDS_ROADS',
    fundingAgency: 'Ministry of DoNER / Assam PWRD',
    sanctionDate: '2023-08-10T00:00:00.000Z',
    sanctionedCost: 24.00,
    revisedCost: 24.00,
    state: 'Assam',
    district: 'Dhubri',
    coDistrict: 'Dhubri Sadar',
    block: 'Gauripur Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Dhubri Old Port Area',
    latitude: 26.0205,
    longitude: 89.9744,
    implementingAgency: 'Assam Inland Water Transport / PWRD',
    contractor: 'M/s Northeast Riverine Projects',
    executingOfficer: 'S. K. Choudhury, SE PWRD',
    technicalSanctionRef: 'TS/PWRD/DHU/2023/0902',
    plannedStartDate: '2023-09-01T00:00:00.000Z',
    plannedEndDate: '2025-06-30T00:00:00.000Z',
    actualStartDate: '2023-09-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 74.0,
    financialSanction: 24.00,
    fundReleased: 20.00,
    expenditure: 19.20,
    ucStatus: 'VERIFIED',
    pendingAmount: 4.00,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-05T09:15:00.000Z',
    daysSinceLastInspection: 20,
    outcomeIndicators: {
      roadKm: 18.2,
      beneficiaries: 120000,
    },
    imagePath: '/images/A_ferry_on_the_river_Brahmaputra.jpg',
    status: 'ONGOING',
    delayRiskScore: 32,
    evidenceScore: 82,
    grievancesCount: 4,
    milestones: [],
    inspections: [],
  },

  // PM-DevINE Kamrup
  {
    id: 'proj-as-kam-1049',
    workCode: 'AS-KAM-1049',
    title: 'Sub-Divisional Civil Hospital Cold-Storage & Solar Microgrid',
    scheme: 'PM_DEVINE',
    fundingAgency: 'Ministry of DoNER / Central Sector',
    sanctionDate: '2024-06-10T00:00:00.000Z',
    sanctionedCost: 6.50,
    revisedCost: 6.50,
    state: 'Assam',
    district: 'Kamrup Rural',
    coDistrict: 'Rangia',
    block: 'Rangia Central',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Rangia Town Ward-4',
    latitude: 26.4687,
    longitude: 91.6247,
    implementingAgency: 'PWD Electrical Division',
    contractor: 'M/s GreenEnergy Assam Pvt Ltd',
    executingOfficer: 'Dr. Himashree Sarma, EE PWD',
    technicalSanctionRef: 'TS/PWD-ELEC/KAM/2024/1049',
    plannedStartDate: '2024-07-01T00:00:00.000Z',
    plannedEndDate: '2025-06-30T00:00:00.000Z',
    actualStartDate: '2024-07-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 68.0,
    financialSanction: 6.50,
    fundReleased: 4.20,
    expenditure: 4.20,
    ucStatus: 'SUBMITTED',
    pendingAmount: 2.30,
    pendingUcAgeDays: 45,
    lastInspectionDate: '2026-03-18T11:00:00.000Z',
    daysSinceLastInspection: 7,
    outcomeIndicators: {
      beds: 50,
      solarCapacityKw: 25,
      beneficiaries: 34000,
    },
    imagePath: '/images/021_Charm_of_a_colonial_building_with_a_newly_constructed_approch_road_jpg.jpg',
    status: 'ONGOING',
    delayRiskScore: 36,
    evidenceScore: 78,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },

  // SDP Sixth Schedule Kokrajhar (BTC)
  {
    id: 'proj-as-btc-0412',
    workCode: 'AS-BTC-0412',
    title: 'Multipurpose Flood Shelter & Connecting Embankment Road',
    scheme: 'SDP',
    fundingAgency: 'Bodoland Territorial Council (BTC) / State Special Package',
    sanctionDate: '2024-03-20T00:00:00.000Z',
    sanctionedCost: 6.20,
    revisedCost: 6.20,
    state: 'Assam',
    district: 'Kokrajhar',
    coDistrict: 'Kokrajhar Sadar',
    block: 'Dotma Development Block',
    adcArea: 'BTC',
    governanceType: 'SIXTH_SCHEDULE_ADC',
    villageWard: 'Serfanguri',
    latitude: 26.4012,
    longitude: 90.2715,
    implementingAgency: 'BTC Engineering Wing',
    contractor: 'M/s Bodoland Construct Co.',
    executingOfficer: 'B. Basumatary, AE BTC',
    technicalSanctionRef: 'TS/BTC/ENG/2024/0412',
    plannedStartDate: '2024-04-15T00:00:00.000Z',
    plannedEndDate: '2025-10-31T00:00:00.000Z',
    actualStartDate: '2024-05-01T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 45.0,
    financialSanction: 6.20,
    fundReleased: 3.10,
    expenditure: 3.10,
    ucStatus: 'SUBMITTED',
    pendingAmount: 3.10,
    pendingUcAgeDays: 62,
    lastInspectionDate: '2026-02-14T15:30:00.000Z',
    daysSinceLastInspection: 40,
    outcomeIndicators: {
      roadKm: 8.5,
      beneficiaries: 14000,
    },
    imagePath: '/images/Legislativrat_des_Bodolands_in_Kokrajhar.jpg',
    status: 'ONGOING',
    delayRiskScore: 58,
    evidenceScore: 64,
    grievancesCount: 3,
    milestones: [],
    inspections: [],
  },

  // SDP Sixth Schedule Karbi Anglong (KAAC)
  {
    id: 'proj-as-kaa-0622',
    workCode: 'AS-KAA-0622',
    title: 'Karbi Anglong Hills Tribal Livelihood Common Facility Center',
    scheme: 'SDP',
    fundingAgency: 'Karbi Anglong Autonomous Council (KAAC) / SDP',
    sanctionDate: '2024-02-18T00:00:00.000Z',
    sanctionedCost: 5.80,
    revisedCost: 5.80,
    state: 'Assam',
    district: 'Karbi Anglong',
    coDistrict: 'Bokajan',
    block: 'Bokajan Dev Block',
    adcArea: 'KAAC',
    governanceType: 'SIXTH_SCHEDULE_ADC',
    villageWard: 'Bokajan Hills Ward-2',
    latitude: 26.0142,
    longitude: 93.7824,
    implementingAgency: 'KAAC P&RD Wing',
    contractor: 'M/s Karbi Hills Infrastructure',
    executingOfficer: 'L. Teron, EE KAAC Diphu',
    technicalSanctionRef: 'TS/KAAC/ENG/2024/0622',
    plannedStartDate: '2024-03-01T00:00:00.000Z',
    plannedEndDate: '2025-05-31T00:00:00.000Z',
    actualStartDate: '2024-03-20T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 71.0,
    financialSanction: 5.80,
    fundReleased: 4.35,
    expenditure: 4.10,
    ucStatus: 'VERIFIED',
    pendingAmount: 1.45,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-01T12:00:00.000Z',
    daysSinceLastInspection: 24,
    outcomeIndicators: {
      jobsCreated: 320,
      beneficiaries: 8500,
    },
    imagePath: '/images/020_A_close_view_of_Tea_Bushes_with_Tea_Tribe_workers_in_a_Tea_Garden.jpg',
    status: 'ONGOING',
    delayRiskScore: 28,
    evidenceScore: 84,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },

  // SDP Sixth Schedule Dima Hasao (NCHAC)
  {
    id: 'proj-as-dha-0833',
    workCode: 'AS-DHA-0833',
    title: 'Dima Hasao Hill Slope Water Harvest & Gravity Pipeline Network',
    scheme: 'SDP',
    fundingAgency: 'North Cachar Hills Autonomous Council (NCHAC) / SDP',
    sanctionDate: '2024-04-12T00:00:00.000Z',
    sanctionedCost: 7.20,
    revisedCost: 7.20,
    state: 'Assam',
    district: 'Dima Hasao',
    coDistrict: 'Haflong',
    block: 'Jatinga Valley Block',
    adcArea: 'NCHAC',
    governanceType: 'SIXTH_SCHEDULE_ADC',
    villageWard: 'Haflong Hilltop Sector',
    latitude: 25.1842,
    longitude: 93.0182,
    implementingAgency: 'NCHAC Water Resources Dept',
    contractor: 'M/s Barak-Surma Engineering',
    executingOfficer: 'D. Haflongbar, AEE NCHAC',
    technicalSanctionRef: 'TS/NCHAC/WSS/2024/0833',
    plannedStartDate: '2024-05-01T00:00:00.000Z',
    plannedEndDate: '2025-08-31T00:00:00.000Z',
    actualStartDate: '2024-05-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 54.0,
    financialSanction: 7.20,
    fundReleased: 4.00,
    expenditure: 3.90,
    ucStatus: 'SUBMITTED',
    pendingAmount: 3.20,
    pendingUcAgeDays: 52,
    lastInspectionDate: '2026-02-18T14:00:00.000Z',
    daysSinceLastInspection: 36,
    outcomeIndicators: {
      households: 1850,
      beneficiaries: 9200,
    },
    imagePath: '/images/water-resources.jpg',
    status: 'ONGOING',
    delayRiskScore: 46,
    evidenceScore: 72,
    grievancesCount: 2,
    milestones: [],
    inspections: [],
  },

  // NEC Schemes Tinsukia (30% Deprived Area Earmark)
  {
    id: 'proj-as-tin-0512',
    workCode: 'AS-TIN-0512',
    title: 'NEC Regional Citrus & Ginger Processing Corridor (30% Deprived Area Earmark)',
    scheme: 'NEC',
    fundingAgency: 'North Eastern Council (Shillong)',
    sanctionDate: '2023-10-05T00:00:00.000Z',
    sanctionedCost: 9.40,
    revisedCost: 9.40,
    state: 'Assam',
    district: 'Tinsukia',
    coDistrict: 'Margherita',
    block: 'Margherita Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Ledo Coalfield Outskirts',
    latitude: 27.2942,
    longitude: 95.7314,
    implementingAgency: 'Assam Agricultural Marketing Board / NEC',
    contractor: 'M/s Eastern Agro-Infra Ltd',
    executingOfficer: 'N. Sonowal, DD Agriculture Tinsukia',
    technicalSanctionRef: 'TS/NEC/AGRI/2023/0512',
    plannedStartDate: '2023-11-01T00:00:00.000Z',
    plannedEndDate: '2025-04-30T00:00:00.000Z',
    actualStartDate: '2023-11-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 65.0,
    financialSanction: 9.40,
    fundReleased: 6.50,
    expenditure: 6.10,
    ucStatus: 'VERIFIED',
    pendingAmount: 2.90,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-08T10:00:00.000Z',
    daysSinceLastInspection: 17,
    outcomeIndicators: {
      beneficiaries: 18000,
      jobsCreated: 240,
    },
    imagePath: '/images/021_Charm_of_a_colonial_building_with_a_newly_constructed_approch_road_jpg.jpg',
    status: 'ONGOING',
    delayRiskScore: 34,
    evidenceScore: 80,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },

  // MLAADS Jorhat
  {
    id: 'proj-as-jor-0518',
    workCode: 'AS-JOR-0518',
    title: 'Assembly Constituency Rural High School Science Lab & Digital Center',
    scheme: 'MLAADS',
    fundingAgency: 'Transformation & Development Dept / MLAADS',
    sanctionDate: '2024-05-15T00:00:00.000Z',
    sanctionedCost: 1.20,
    revisedCost: 1.20,
    state: 'Assam',
    district: 'Jorhat',
    coDistrict: 'Titabor',
    block: 'Titabor Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Garh Ali Model School',
    latitude: 26.5824,
    longitude: 94.1952,
    implementingAgency: 'PWD Building Division Jorhat',
    contractor: 'M/s Titabor Builders Cooperative',
    executingOfficer: 'Arunav Saikia, AE PWD',
    technicalSanctionRef: 'TS/MLAADS/JOR/2024/0518',
    plannedStartDate: '2024-06-01T00:00:00.000Z',
    plannedEndDate: '2025-02-28T00:00:00.000Z',
    actualStartDate: '2024-06-10T00:00:00.000Z',
    actualEndDate: '2025-02-15T00:00:00.000Z',
    physicalCompletionPct: 95.0,
    financialSanction: 1.20,
    fundReleased: 1.20,
    expenditure: 1.15,
    ucStatus: 'VERIFIED',
    pendingAmount: 0.05,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-12T11:30:00.000Z',
    daysSinceLastInspection: 13,
    outcomeIndicators: {
      classrooms: 4,
      beneficiaries: 1200,
    },
    imagePath: '/images/007_A_photograph_taken_from_the_roadside_of_historic_Garh_Ali_Jorhat_Ass.jpg',
    status: 'COMPLETED',
    delayRiskScore: 10,
    evidenceScore: 94,
    grievancesCount: 0,
    milestones: [],
    inspections: [],
  },

  // Suhrid Barpeta / Bajali
  {
    id: 'proj-as-bar-0244',
    workCode: 'AS-BAR-0244',
    title: 'Suhrid Civic Health & Micro-Infrastructure Sub-Center Hub',
    scheme: 'SUHRID',
    fundingAgency: 'Govt of Assam Suhrid Fund',
    sanctionDate: '2024-07-22T00:00:00.000Z',
    sanctionedCost: 0.85,
    revisedCost: 0.85,
    state: 'Assam',
    district: 'Barpeta',
    coDistrict: 'Bajali',
    block: 'Bhowanipur Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Bhowanipur Gaon',
    latitude: 26.5124,
    longitude: 91.0248,
    implementingAgency: 'National Health Mission / District Civil',
    contractor: 'M/s Pragjyotish Meditech Services',
    executingOfficer: 'Dr. Ranjit Das, SDMO Bajali',
    technicalSanctionRef: 'TS/SUHRID/BAJ/2024/0244',
    plannedStartDate: '2024-08-01T00:00:00.000Z',
    plannedEndDate: '2025-01-31T00:00:00.000Z',
    actualStartDate: '2024-08-15T00:00:00.000Z',
    actualEndDate: '2025-01-20T00:00:00.000Z',
    physicalCompletionPct: 92.0,
    financialSanction: 0.85,
    fundReleased: 0.85,
    expenditure: 0.80,
    ucStatus: 'VERIFIED',
    pendingAmount: 0.05,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-14T10:00:00.000Z',
    daysSinceLastInspection: 11,
    outcomeIndicators: {
      beds: 12,
      beneficiaries: 16000,
    },
    imagePath: '/images/Community_hall,_Tezpur_University.jpg',
    status: 'COMPLETED',
    delayRiskScore: 12,
    evidenceScore: 90,
    grievancesCount: 0,
    milestones: [],
    inspections: [],
  },

  // Untied Funds Golaghat (Kaziranga Buffer)
  {
    id: 'proj-as-gol-0391',
    workCode: 'AS-GOL-0391',
    title: 'Kaziranga Buffer Zone Animal Rescue Corridor & High Ground Shelter',
    scheme: 'UNTIED_FUNDS',
    fundingAgency: 'District Planning Committee Untied Fund',
    sanctionDate: '2024-01-30T00:00:00.000Z',
    sanctionedCost: 2.40,
    revisedCost: 2.40,
    state: 'Assam',
    district: 'Golaghat',
    coDistrict: 'Bokakhat',
    block: 'Bokakhat Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Kohora Fringe Sector',
    latitude: 26.5812,
    longitude: 93.4124,
    implementingAgency: 'Environment & Forest Dept / DPC Golaghat',
    contractor: 'M/s Kaziranga Eco-Builders',
    executingOfficer: 'R. K. Das, DFO Eastern Assam Wildlife',
    technicalSanctionRef: 'TS/UNTIED/GOL/2024/0391',
    plannedStartDate: '2024-02-15T00:00:00.000Z',
    plannedEndDate: '2025-03-31T00:00:00.000Z',
    actualStartDate: '2024-03-01T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 79.0,
    financialSanction: 2.40,
    fundReleased: 2.00,
    expenditure: 1.90,
    ucStatus: 'VERIFIED',
    pendingAmount: 0.40,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-02T16:00:00.000Z',
    daysSinceLastInspection: 23,
    outcomeIndicators: {
      beneficiaries: 22000,
    },
    imagePath: '/images/hero-landscape.jpg',
    status: 'ONGOING',
    delayRiskScore: 26,
    evidenceScore: 86,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },

  // Assam Darshan Nagaon (Kaliabor)
  {
    id: 'proj-as-nag-0105',
    workCode: 'AS-NAG-0105',
    title: 'Assam Darshan — Preservation & Pilgrim Amenities at Historic Satra Shrine',
    scheme: 'ASSAM_DARSHAN',
    fundingAgency: 'Transformation & Development Dept / Assam Darshan',
    sanctionDate: '2023-12-10T00:00:00.000Z',
    sanctionedCost: 1.50,
    revisedCost: 1.50,
    state: 'Assam',
    district: 'Nagaon',
    coDistrict: 'Kaliabor',
    block: 'Kaliabor Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Silghat Satra Campus',
    latitude: 26.6124,
    longitude: 92.9412,
    implementingAgency: 'Cultural Affairs Directorate',
    contractor: 'M/s Brahmaputra Heritage Conservation',
    executingOfficer: 'M. Goswami, Joint Director Cultural Affairs',
    technicalSanctionRef: 'TS/DARSHAN/NAG/2023/0105',
    plannedStartDate: '2024-01-01T00:00:00.000Z',
    plannedEndDate: '2025-02-28T00:00:00.000Z',
    actualStartDate: '2024-01-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 88.0,
    financialSanction: 1.50,
    fundReleased: 1.35,
    expenditure: 1.25,
    ucStatus: 'VERIFIED',
    pendingAmount: 0.15,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-10T12:00:00.000Z',
    daysSinceLastInspection: 15,
    outcomeIndicators: {
      beneficiaries: 65000,
    },
    imagePath: '/images/008_A_photograph_taken_from_the_roadside_of_historic_Garh_Ali_Jorhat_Ass.jpg',
    status: 'ONGOING',
    delayRiskScore: 18,
    evidenceScore: 91,
    grievancesCount: 0,
    milestones: [],
    inspections: [],
  },

  // Assam Adarsh Gram Yojana Lakhimpur
  {
    id: 'proj-as-lak-0720',
    workCode: 'AS-LAK-0720',
    title: 'Assam Adarsh Gram Model Village Holistic Infrastructure & Solar Grid',
    scheme: 'AAGY',
    fundingAgency: 'P&RD Department, Govt of Assam',
    sanctionDate: '2024-03-01T00:00:00.000Z',
    sanctionedCost: 3.60,
    revisedCost: 3.60,
    state: 'Assam',
    district: 'Lakhimpur',
    coDistrict: 'Dhakuakhana',
    block: 'Dhakuakhana Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Matmora Adarsh Gaon',
    latitude: 27.1242,
    longitude: 94.4812,
    implementingAgency: 'Panchayat & Rural Development (P&RD)',
    contractor: 'M/s Lakhimpur Rural Infra Ltd',
    executingOfficer: 'K. Gogoi, BDO Dhakuakhana',
    technicalSanctionRef: 'TS/AAGY/LAK/2024/0720',
    plannedStartDate: '2024-03-15T00:00:00.000Z',
    plannedEndDate: '2025-06-30T00:00:00.000Z',
    actualStartDate: '2024-04-01T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 75.0,
    financialSanction: 3.60,
    fundReleased: 2.80,
    expenditure: 2.70,
    ucStatus: 'VERIFIED',
    pendingAmount: 0.80,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-11T13:00:00.000Z',
    daysSinceLastInspection: 14,
    outcomeIndicators: {
      households: 650,
      solarCapacityKw: 40,
      beneficiaries: 3800,
    },
    imagePath: '/images/school-lakhimpur.jpg',
    status: 'ONGOING',
    delayRiskScore: 28,
    evidenceScore: 85,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },

  // National Schemes Synergy: Dhubri Bilasipara
  {
    id: 'proj-as-dub-0619',
    workCode: 'AS-DUB-0619',
    title: 'National JJM + PMGSY Synergistic Border Road & Water Trunk Integration',
    scheme: 'NATIONAL_JJM_PMGSY_CUSTOM',
    fundingAgency: 'Ministry of Rural Development & Jal Shakti (90:10)',
    sanctionDate: '2024-02-14T00:00:00.000Z',
    sanctionedCost: 8.90,
    revisedCost: 8.90,
    state: 'Assam',
    district: 'Dhubri',
    coDistrict: 'Bilasipara',
    block: 'Bilasipara Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Bilasipara Char Ward-7',
    latitude: 26.2341,
    longitude: 90.2312,
    implementingAgency: 'Joint Taskforce PWRD & PHED Dhubri',
    contractor: 'M/s Lower Assam Infrastructure Consortium',
    executingOfficer: 'M. Ali, EE Bilasipara Sub-Division',
    technicalSanctionRef: 'TS/JJM-PMGSY/DUB/2024/0619',
    plannedStartDate: '2024-03-01T00:00:00.000Z',
    plannedEndDate: '2025-05-31T00:00:00.000Z',
    actualStartDate: '2024-03-15T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 80.0,
    financialSanction: 8.90,
    fundReleased: 7.20,
    expenditure: 7.10,
    ucStatus: 'VERIFIED',
    pendingAmount: 1.70,
    pendingUcAgeDays: 0,
    lastInspectionDate: '2026-03-15T10:45:00.000Z',
    daysSinceLastInspection: 10,
    outcomeIndicators: {
      roadKm: 14.0,
      waterConnections: 720,
      beneficiaries: 21000,
    },
    imagePath: '/images/river-embankment.jpg',
    status: 'ONGOING',
    delayRiskScore: 22,
    evidenceScore: 89,
    grievancesCount: 2,
    milestones: [],
    inspections: [],
  },

  // PM-DevINE Dibrugarh Naharkatia
  {
    id: 'proj-as-dib-0731',
    workCode: 'AS-DIB-0731',
    title: 'PM-DevINE Bamboo Composite Industrial Cluster & Skill Center',
    scheme: 'PM_DEVINE',
    fundingAgency: 'Ministry of DoNER / Central Sector',
    sanctionDate: '2024-05-18T00:00:00.000Z',
    sanctionedCost: 14.00,
    revisedCost: 14.00,
    state: 'Assam',
    district: 'Dibrugarh',
    coDistrict: 'Naharkatia',
    block: 'Joypur Dev Block',
    adcArea: null,
    governanceType: 'PANCHAYAT_GRAM_SABHA',
    villageWard: 'Joypur Rainforest Fringe',
    latitude: 27.2842,
    longitude: 95.3184,
    implementingAgency: 'Industries & Commerce Dept / MDoNER',
    contractor: 'M/s Upper Assam Eco-Wood Works',
    executingOfficer: 'P. Borgohain, GM DIC Dibrugarh',
    technicalSanctionRef: 'TS/PMDEVINE/DIB/2024/0731',
    plannedStartDate: '2024-06-01T00:00:00.000Z',
    plannedEndDate: '2026-03-31T00:00:00.000Z',
    actualStartDate: '2024-06-20T00:00:00.000Z',
    actualEndDate: null,
    physicalCompletionPct: 60.0,
    financialSanction: 14.00,
    fundReleased: 9.00,
    expenditure: 8.40,
    ucStatus: 'SUBMITTED',
    pendingAmount: 5.00,
    pendingUcAgeDays: 38,
    lastInspectionDate: '2026-03-07T11:20:00.000Z',
    daysSinceLastInspection: 18,
    outcomeIndicators: {
      jobsCreated: 580,
      beneficiaries: 28000,
    },
    imagePath: '/images/020_A_close_view_of_Tea_Bushes_with_Tea_Tribe_workers_in_a_Tea_Garden.jpg',
    status: 'ONGOING',
    delayRiskScore: 35,
    evidenceScore: 81,
    grievancesCount: 1,
    milestones: [],
    inspections: [],
  },
];

// =========================================================================
// 3. CANONICAL GAZETTE NOTICES & STATUTORY ORDERS
// =========================================================================
export const CANONICAL_NOTICES: CanonicalNotice[] = [
  {
    id: 'notice-sipajhar-0821',
    title: 'Stop-Work & Financial Discrepancy Mandate: Sipajhar Multi-Village WSS',
    issuingAuthority: 'Planning & Transformation Dept, Dispur',
    publishedAt: '2026-03-24T06:00:00Z',
    effectiveAt: '2026-03-24T06:00:00Z',
    status: 'ACTIVE',
    department: 'PHED / Planning Dept',
    district: 'Darrang',
    year: 2026,
    documentType: 'STOP_WORK_NOTICE',
    originalText: `ORDER UNDER SECTION 14(2) OF THE ASSAM DECENTRALIZED PLANNING & STATUTORY ACCOUNTABILITY DIRECTIVE, 2024.
WHEREAS, an on-site physical audit was conducted on 18th March 2026 at Sipajhar Multi-Village Piped Drinking Water Supply Scheme (Project ID: AS-DAR-0821); and
WHEREAS, the public expenditure ledger verifies that an aggregate sum of ₹8,80,00,000/- (80.00% of sanctioned outlay) has been debited to the contractor, M/s Brahmaputra Infra-Engg Ltd; and
WHEREAS, the on-ground audit report and high-resolution geotagged drone imagery establish verified physical execution at merely 35.00%, revealing an unexplained fiscal-physical variance of 45.00%;
NOW THEREFORE, all further fiscal disbursements are hereby FROZEN. The contractor and executing division are ordered to cease bill claims immediately pending CAG Special Inquest Form 19-B submission.`,
    plainSummary: 'Government paid ₹8.80 Cr (80%) to contractor but only 35% of water pipeline was built. Main intake well excavation abandoned since January 2026. All further contractor payments frozen under Section 14(2). Citizens can demand emergency water bowsers within 48 hours under RTPS Act 2012.',
    actionChecklist: [
      'File RTPS Form-4 inquiry at Sipajhar Co-District office',
      'Demand emergency drinking water bowsers (48-hour statutory SLA)',
      'Track fund freeze status on Drishti portal',
      'Submit grievance if water supply not restored within SLA',
    ],
    sourceUrl: 'https://gazette.assam.gov.in/Gazette/2026/089',
    translations: {
      en: 'Government paid ₹8.80 Cr (80%) to contractor but only 35% of water pipeline was built. Main intake well excavation abandoned since January 2026. All further payments frozen. Citizens can demand emergency water bowsers within 48 hours under RTPS Act 2012.',
      as: 'চৰকাৰে ৮.৮০ কোটি টকা (৮০%) আদায় দিয়াৰ পিছতো চিপাঝাৰ পানী যোগান প্ৰকল্পৰ মাত্ৰ ৩৫% কামহে সম্পূৰ্ণ হৈছে। মুখ্য পানী তোলা কুঁৱা জানুৱাৰী মাহৰ পৰা এৰি থৈ যোৱা হৈছে। ১৪(২) ধাৰা অনুসৰি ঠিকাদাৰৰ সকলো বিল বন্ধ কৰা হৈছে। অসম লোকসেৱা প্ৰদান আইন ২০১২ (RTPS) ৰ অধীনত নাগৰিকসকলে ৪৮ ঘণ্টাৰ ভিতৰত জৰুৰীকালীন পানী যোগান দাবী কৰিব পাৰে।',
      hi: 'सिपाझार पेयजल योजना के लिए ठेकेदार को ₹8.80 करोड़ (80%) का भुगतान किया गया, लेकिन केवल 35% कार्य ही पूरा हुआ। मुख्य इंटेक वेल का उत्खनन जनवरी 2026 से बंद है। धारा 14(2) के तहत सभी भुगतान रोक दिए गए हैं। ग्रामीण 48 घंटे में आपातकालीन पानी का टैंकर मांग सकते हैं।',
      bn: 'সিপাহীঝাড় পানীয় জল প্রকল্পের জন্য ঠিকাদারকে ৮.৮০ কোটি টাকা (৮০%) দেওয়া হলেও মাত্র ৩৫% কাজ শেষ হয়েছে। মুখ্য ইনটেক কুয়া খনন জানুয়ারি ২০২৬ থেকে বন্ধ। ধারা ১৪(২) এর অধীন সমস্ত پرداخت বন্ধ। নাগরিকরা ৪৮ ঘণ্টার মধ্যে জরুরি পানীয় জলের ট্যাঙ্কার দাবি করতে পারেন।',
    },
    imagePath: '/images/011_Manmohan_Singh_addressing_at_the_presentation_of_the_Fakhruddin_Ali_Ah.jpg',
  },
  {
    id: 'notice-kokrajhar-104',
    title: 'Release of Q4 Tranche for Kokrajhar Rural Road Connectivity Network under SOPD-G',
    issuingAuthority: 'Finance (Special Schemes) Dept, Dispur',
    publishedAt: '2026-03-22T08:30:00Z',
    effectiveAt: '2026-03-22T08:30:00Z',
    status: 'ACTIVE',
    department: 'Finance / BTC',
    district: 'Kokrajhar',
    year: 2026,
    documentType: 'SANCTION_MANDATE',
    originalText: 'Administrative approval and financial sanction for release of ₹14.50 Crore direct to Bodoland Territorial Council (BTC) treasury for 22 village road stretches under SOPD-G Sixth Schedule package. Funds to be utilized for construction of all-weather rural roads connecting 45 habitations in Dotma and Gossaigaon blocks.',
    plainSummary: '₹14.50 Crore released directly to BTC treasury for 22 rural roads in Kokrajhar under SOPD-G Sixth Schedule package. Will connect 45 habitations in Dotma and Gossaigaon blocks.',
    actionChecklist: [
      'Monitor road construction progress via Drishti portal',
      'Verify fund utilization against physical milestones',
      'Report road quality issues through citizen grievance portal',
    ],
    sourceUrl: 'https://finance.assam.gov.in/orders/2026/104',
    translations: {
      en: '₹14.50 Crore released directly to BTC treasury for 22 rural roads in Kokrajhar under SOPD-G Sixth Schedule package. Will connect 45 habitations in Dotma and Gossaigaon blocks.',
      as: 'বিটিচিৰ কোকৰাঝাৰ গ্ৰাম্য পথ সংযোগৰ চতুৰ্থ কিস্তিৰ বাবে ১৪.৫০ কোটি টকা মুকলি কৰা হৈছে। ডটমা আৰু গোসাইগাঁও ব্লকত ৪৫টি বসতি সংযোগ কৰিব।',
      hi: 'एसओपीडी-जी के तहत कोकराझार ग्रामीण सड़क नेटवर्क के लिए ₹14.50 करोड़ की चौथी किस्त सीधे बीटीसी खजाने को जारी की गई। डोत्मा और गोसाईगांव ब्लॉक में 45 बस्तियाँ जुड़ेंगी।',
      bn: 'এসওপিডি-জি এর অধীনে কোকরাঝাড় গ্রামীণ সড়ক নেটওয়ার্কের জন্য ১৪.৫০ কোটি টাকার চতুর্থ কিস্তি সরাসরি বিটিসি খাজানায় বরাদ্দ। ডোতমা এবং গোসাইগাঁও ব্লকে ৪৫টি বসতি সংযুক্ত হবে।',
    },
    imagePath: '/images/012_Manmohan_Singh_addressing_at_the_presentation_of_the_Fakhruddin_Ali_Ah.jpg',
  },
  {
    id: 'notice-majuli-045',
    title: 'Brahmaputra Flood Embankment Geo-Bag Reinforcement Mandate, Majuli',
    issuingAuthority: 'Water Resources Dept, Dispur',
    publishedAt: '2026-03-15T09:00:00Z',
    effectiveAt: '2026-03-15T09:00:00Z',
    status: 'ACTIVE',
    department: 'Water Resources',
    district: 'Majuli',
    year: 2026,
    documentType: 'GAZETTE_ORDER',
    originalText: 'Notice for pre-monsoon bank stabilization along Kamalabari and Jengraimukh sectors. Mandates geo-textile bag installation with daily drone photogrammetry telemetry to ensure river protection compliance.',
    plainSummary: 'Pre-monsoon bank protection orders for Majuli Island. Requires geo-bags and daily drone verification to safeguard Kamalabari from river erosion.',
    actionChecklist: [
      'Inspect geo-bag placement quality along riverbank',
      'Submit drone verification reports by 15th April',
    ],
    translations: {
      en: 'Pre-monsoon bank protection orders for Majuli Island. Requires geo-bags and daily drone verification.',
      as: 'মাজুলী দ্বীপৰ বাৰিষাৰ পূৰ্বে খহনীয়া প্ৰতিৰোধৰ বাবে জিঅ’-বেগ সংস্থাপন আৰু দৈনিক ড্ৰোন পৰীক্ষণ নিৰ্দেশ।',
      hi: 'माजुली द्वीप के लिए मानसून पूर्व तटबंध सुरक्षा आदेश। जियो-बैग स्थापना और ड्रोन सत्यापन अनिवार्य।',
      bn: 'মাজুলী দ্বীপের প্রাক-বর্ষা ভাঙন রোধের জন্য জিও-ব্যাগ স্থাপন ও ড্রোন যাচাইকরণের নির্দেশ।',
    },
    imagePath: '/images/009_Majuli_Assam_India_River_Island.jpg',
  },
];

// =========================================================================
// 4. REAL-TIME EVENT-DRIVEN ACTIVITY LEDGER
// =========================================================================
export const CANONICAL_EVENTS: CanonicalEvent[] = [
  {
    id: 'evt-01',
    timestamp: '2026-03-24T06:00:00Z',
    type: 'ADMINISTRATIVE',
    title: 'Statutory Stop-Work Notice Enforced under Section 14(2)',
    description: 'Planning & Transformation Department froze ₹2.20 Cr remaining tranche for Sipajhar Rural WSS (AS-DAR-0821) due to 45% fiscal-physical gap.',
    actor: 'Secretary, Planning Dept',
    projectWorkCode: 'AS-DAR-0821',
    district: 'Darrang',
    coDistrict: 'Sipajhar',
    badge: 'Section 14(2)',
    severity: 'ALERT',
  },
  {
    id: 'evt-02',
    timestamp: '2026-03-22T08:30:00Z',
    type: 'FINANCIAL',
    title: 'SOPD-G Q4 Tranche Disbursement Released',
    description: '₹14.50 Crore direct release to Bodoland Territorial Council treasury for 22 village road stretches in Kokrajhar.',
    actor: 'Finance Dept Dispur',
    projectWorkCode: 'AS-BTC-0412',
    district: 'Kokrajhar',
    coDistrict: 'Kokrajhar Sadar',
    badge: '₹14.50 Cr',
    severity: 'SUCCESS',
  },
  {
    id: 'evt-03',
    timestamp: '2026-03-18T11:00:00Z',
    type: 'FIELD',
    title: 'Geo-Tagged Photo Audit & Milestone Telemetry Uploaded',
    description: 'Field Officer Dr. Himashree Sarma uploaded cryptographically signed EXIF photos verifying 68% progress at Rangia Civil Hospital.',
    actor: 'Dr. Himashree Sarma (EE)',
    projectWorkCode: 'AS-KAM-1049',
    district: 'Kamrup Rural',
    coDistrict: 'Rangia',
    badge: 'EXIF GPS Locked',
    severity: 'NORMAL',
  },
  {
    id: 'evt-04',
    timestamp: '2026-03-16T14:45:00Z',
    type: 'CITIZEN',
    title: 'Gram Sabha Attestation & Citizen Verification Vote Recorded',
    description: 'Gaon Sabha #14 Titabor officially voted 42–1 to attest completed civil works for Garh Ali High School Science Lab.',
    actor: 'Gram Sabha Titabor',
    projectWorkCode: 'AS-JOR-0518',
    district: 'Jorhat',
    coDistrict: 'Titabor',
    badge: 'Citizen Attested',
    severity: 'SUCCESS',
  },
  {
    id: 'evt-05',
    timestamp: '2026-03-15T09:15:00Z',
    type: 'SYSTEM',
    title: 'Sentinel-2 Multi-Spectral Surface Verification Completed',
    description: 'Automated satellite pass verified 24.5km embankment alignment on Majuli Island with 4.8% delta to physical survey.',
    actor: 'Drishti GIS Telemetry Engine',
    projectWorkCode: 'AS-MAJ-0301',
    district: 'Majuli',
    coDistrict: 'Garamur',
    badge: 'Sentinel-2 Match',
    severity: 'NORMAL',
  },
  {
    id: 'evt-06',
    timestamp: '2026-03-14T10:00:00Z',
    type: 'CITIZEN',
    title: 'RTPS Citizen Grievance Ticket Dispatched (DRI-GRV-2026-0821)',
    description: 'Resident of Sipajhar filed formal grievance citing lack of drinking water supply and abandoned intake well.',
    actor: 'Citizen Bhaben Deka',
    projectWorkCode: 'AS-DAR-0821',
    district: 'Darrang',
    coDistrict: 'Sipajhar',
    badge: 'RTPS 15-Day SLA',
    severity: 'WARNING',
  },
];

// =========================================================================
// 5. CANONICAL GRIEVANCES
// =========================================================================
export const CANONICAL_GRIEVANCES: CanonicalGrievance[] = [
  {
    id: 'grv-01',
    ticketCode: 'DRI-GRV-2026-0821',
    projectWorkCode: 'AS-DAR-0821',
    category: 'WATER_SUPPLY_HALT',
    department: 'Public Health Engineering Dept (PHED)',
    district: 'Darrang',
    coDistrict: 'Sipajhar',
    description: 'Contractor abandoned water pipeline excavation along NH-15 feeder 74 days ago. Village has no functional piped water despite 80% fund release.',
    citizenName: 'Bhaben Deka',
    contactNumber: '+91 94350 *****',
    status: 'ACTION_REQUIRED',
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-24T06:30:00Z',
    timeline: [
      { status: 'SUBMITTED', date: '2026-03-14T10:00:00Z', note: 'Grievance submitted by citizen via Drishti QR scan.' },
      { status: 'UNDER_REVIEW', date: '2026-03-16T11:00:00Z', note: 'Assigned to Co-District Commissioner Sipajhar.', officer: 'Sipajhar SDO(Civil)' },
      { status: 'ACTION_REQUIRED', date: '2026-03-24T06:30:00Z', note: 'Section 14(2) stop-work order issued. Emergency water bowsers ordered.', officer: 'Deputy Commissioner Darrang' },
    ],
  },
  {
    id: 'grv-02',
    ticketCode: 'DRI-GRV-2026-0412',
    projectWorkCode: 'AS-BTC-0412',
    category: 'STALLED_WORK',
    department: 'BTC Engineering Wing',
    district: 'Kokrajhar',
    coDistrict: 'Kokrajhar Sadar',
    description: 'Flood shelter ramp construction delayed before monsoon season. Access road requires culvert completion.',
    citizenName: 'Anil Basumatary',
    contactNumber: '+91 98640 *****',
    status: 'UNDER_REVIEW',
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-12T09:30:00Z',
    timeline: [
      { status: 'SUBMITTED', date: '2026-03-10T14:00:00Z', note: 'Submitted via citizen portal.' },
      { status: 'UNDER_REVIEW', date: '2026-03-12T09:30:00Z', note: 'Forwarded to BTC AE Dotma Block.' },
    ],
  },
];
