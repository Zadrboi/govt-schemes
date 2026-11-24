/**
 * Poorvottar Drishti — Explainable Intelligence Engine
 * Pure, deterministic, zero-black-box rules for statutory audit & monitoring.
 * All functions are side-effect free, testable, and auditable.
 */

import type { ProjectWork, PhysicalMilestone, FieldInspection, Grievance } from '@prisma/client';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface StalledWorkResult {
  isStalled: boolean;
  stalledDays: number;
  threshold: 30 | 60 | 90;
  severity: 'NONE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  lastActivityDate: Date | null;
  activitySource: 'inspection' | 'milestone' | 'none';
}

export interface FinancialPhysicalMismatchResult {
  isMismatch: boolean;
  financialPct: number;
  physicalPct: number;
  varianceGapPct: number;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  direction: 'financial_ahead' | 'physical_ahead' | 'balanced';
}

export interface DelayRiskFactor {
  name: string;
  weight: number;
  value: number;
  maxValue: number;
  description: string;
}

export interface DelayRiskScoreResult {
  score: number; // 0-100
  category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: DelayRiskFactor[];
  statutoryAction: string;
}

export interface EvidenceScoreComponent {
  geoTaggedPhotoRecency: number; // 0-40
  milestoneCertification: number; // 0-30
  citizenReports: number; // 0-20
  ucStatus: number; // 0-10
}

export interface EvidenceScoreResult {
  score: number; // 0-100
  components: EvidenceScoreComponent;
  verdict: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'INSUFFICIENT';
}

export interface DuplicateMatch {
  projectId: string;
  distanceMeters: number;
  matchReason: 'proximity_same_contractor' | 'proximity_similar_name' | 'duplicate_uc_reference';
  title: string;
  contractor: string | null;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
  reason?: string;
}

export interface EquityLensByArea {
  totalFunding: number;
  totalPhysicalDelivery: number;
  projectCount: number;
  avgFundingPerProject: number;
  avgPhysicalDeliveryPerProject: number;
  underservedBlocks: string[];
}

export interface EquityLensResult {
  byAdcArea: Record<string, EquityLensByArea>;
  equityIndex: number; // 0-100 (100 = perfect equity)
  underservedBlocks: string[];
  recommendations: string[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const latDiff = (lat2 - lat1) * 111320;
  const lonDiff = (lon2 - lon1) * 111320 * Math.cos(lat1 * (Math.PI / 180));
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function daysBetween(date1: Date, date2: Date): number {
  return Math.max(0, Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)));
}

function getMostRecentActivityDate(
  project: ProjectWork,
  milestones: PhysicalMilestone[],
  inspections: FieldInspection[]
): { date: Date | null; source: 'inspection' | 'milestone' | 'none' } {
  let mostRecent: Date | null = null;
  let source: 'inspection' | 'milestone' | 'none' = 'none';

  // Check inspections
  for (const insp of inspections) {
    const d = insp.exifTimestamp ? new Date(insp.exifTimestamp) : new Date(insp.createdAt);
    if (!mostRecent || d > mostRecent) {
      mostRecent = d;
      source = 'inspection';
    }
  }

  // Check verified milestones
  for (const ms of milestones) {
    if (ms.verified && ms.verifiedAt) {
      const d = new Date(ms.verifiedAt);
      if (!mostRecent || d > mostRecent) {
        mostRecent = d;
        source = 'milestone';
      }
    } else if (ms.actualDate) {
      const d = new Date(ms.actualDate);
      if (!mostRecent || d > mostRecent) {
        mostRecent = d;
        source = 'milestone';
      }
    }
  }

  // Fallback to project lastInspectionDate
  if (!mostRecent && project.lastInspectionDate) {
    mostRecent = new Date(project.lastInspectionDate);
    source = 'inspection';
  }

  return { date: mostRecent, source };
}

function calculateFinancialPct(project: ProjectWork): number {
  if (project.financialSanction <= 0) return 0;
  return Math.round((project.expenditure / project.financialSanction) * 1000) / 10; // 1 decimal
}

// ============================================
// RULE 1: DETECT STALLED WORK
// ============================================

/**
 * Flags works with no geo-tagged inspection/milestone update for 30 / 60 / 90+ days.
 * Thresholds: 30d = WARNING, 60d = HIGH, 90d = CRITICAL
 */
export function detectStalledWork(
  project: ProjectWork,
  milestones: PhysicalMilestone[],
  inspections: FieldInspection[],
  referenceDate: Date = new Date()
): StalledWorkResult {
  const { date: lastActivityDate, source } = getMostRecentActivityDate(project, milestones, inspections);

  let stalledDays: number;
  if (lastActivityDate) {
    stalledDays = daysBetween(lastActivityDate, referenceDate);
  } else {
    // No activity ever - use sanction date or 90 days
    stalledDays = project.sanctionDate ? daysBetween(new Date(project.sanctionDate), referenceDate) : 90;
  }

  let severity: StalledWorkResult['severity'] = 'NONE';
  let threshold: StalledWorkResult['threshold'] = 30;

  if (stalledDays >= 90) {
    severity = 'CRITICAL';
    threshold = 90;
  } else if (stalledDays >= 60) {
    severity = 'HIGH';
    threshold = 60;
  } else if (stalledDays >= 30) {
    severity = 'WARNING';
    threshold = 30;
  }

  return {
    isStalled: stalledDays >= 60, // Statutory threshold for "stalled" = 60 days
    stalledDays,
    threshold,
    severity,
    lastActivityDate,
    activitySource: source,
  };
}

// ============================================
// RULE 2: DETECT FINANCIAL-PHYSICAL MISMATCH
// ============================================

/**
 * Flags variance >20% (high expenditure + low physical verification,
 * or high physical + zero expenditure).
 */
export function detectFinancialPhysicalMismatch(project: ProjectWork): FinancialPhysicalMismatchResult {
  const financialPct = calculateFinancialPct(project);
  const physicalPct = project.physicalCompletionPct;
  const varianceGapPct = Math.round((financialPct - physicalPct) * 10) / 10;

  let isMismatch = false;
  let severity: FinancialPhysicalMismatchResult['severity'] = 'NONE';
  let direction: FinancialPhysicalMismatchResult['direction'] = 'balanced';

  // Primary check: financial ahead of physical by >=20%
  if (varianceGapPct >= 20) {
    isMismatch = true;
    direction = 'financial_ahead';
    if (varianceGapPct >= 40) severity = 'CRITICAL';
    else if (varianceGapPct >= 30) severity = 'HIGH';
    else if (varianceGapPct >= 25) severity = 'MEDIUM';
    else severity = 'LOW';
  }
  // Secondary check: physical ahead but zero/near-zero expenditure (ghost billing risk)
  else if (physicalPct >= 50 && financialPct < 5) {
    isMismatch = true;
    direction = 'physical_ahead';
    severity = 'HIGH';
  }
  // Tertiary: physical significantly ahead (possible measurement error)
  else if (physicalPct - financialPct > 30) {
    isMismatch = true;
    direction = 'physical_ahead';
    severity = 'MEDIUM';
  }

  return {
    isMismatch,
    financialPct,
    physicalPct,
    varianceGapPct,
    severity,
    direction,
  };
}

// ============================================
// RULE 3: CALCULATE DELAY RISK SCORE (0-100)
// ============================================

/**
 * Returns score + exact transparent factor breakdown:
 * - days overdue (25% weight)
 * - inspection gap (25% weight)
 * - financial-physical mismatch (25% weight)
 * - repeat contractor flags (15% weight)
 * - pending UC ageing (10% weight)
 */
export function calculateDelayRiskScore(
  project: ProjectWork,
  inspections: FieldInspection[],
  milestones: PhysicalMilestone[],
  referenceDate: Date = new Date(),
  allProjects: ProjectWork[] = []
): DelayRiskScoreResult {
  const factors: DelayRiskFactor[] = [];

  // 1. Days Overdue (plannedEndDate vs now)
  const plannedEnd = new Date(project.plannedEndDate);
  const daysOverdue = daysBetween(plannedEnd, referenceDate);
  const overdueValue = Math.min(100, daysOverdue > 0 ? (daysOverdue / 90) * 100 : 0);
  factors.push({
    name: 'daysOverdue',
    weight: 0.25,
    value: Math.round(overdueValue),
    maxValue: 100,
    description: `Project ${daysOverdue > 0 ? `${daysOverdue} days overdue` : 'not yet overdue'} against planned end date`,
  });

  // 2. Inspection Gap
  const { date: lastActivityDate } = getMostRecentActivityDate(project, milestones, inspections);
  const inspectionGapDays = lastActivityDate ? daysBetween(lastActivityDate, referenceDate) : 90;
  const inspectionGapValue = Math.min(100, (inspectionGapDays / 90) * 100);
  factors.push({
    name: 'inspectionGap',
    weight: 0.25,
    value: Math.round(inspectionGapValue),
    maxValue: 100,
    description: `No verified activity for ${inspectionGapDays} days`,
  });

  // 3. Financial-Physical Mismatch
  const mismatch = detectFinancialPhysicalMismatch(project);
  const mismatchValue = Math.min(100, Math.max(0, mismatch.varianceGapPct * 2));
  factors.push({
    name: 'financialPhysicalMismatch',
    weight: 0.25,
    value: Math.round(mismatchValue),
    maxValue: 100,
    description: `Financial-physical variance gap: ${mismatch.varianceGapPct}% (${mismatch.direction})`,
  });

  // 4. Repeat Contractor Flags
  let contractorFlagValue = 0;
  if (project.contractor) {
    const contractorProjects = allProjects.filter(
      p => p.contractor?.toLowerCase() === project.contractor!.toLowerCase() && p.id !== project.id
    );
    const stalledContractorProjects = contractorProjects.filter(p => {
      const { date } = getMostRecentActivityDate(p, [], []);
      return date && daysBetween(date, referenceDate) >= 60;
    });
    contractorFlagValue = Math.min(100, stalledContractorProjects.length * 25);
  }
  factors.push({
    name: 'repeatContractorFlags',
    weight: 0.15,
    value: contractorFlagValue,
    maxValue: 100,
    description: `Contractor has ${contractorFlagValue > 0 ? 'other stalled projects' : 'no other stalled projects'}`,
  });

  // 5. Pending UC Ageing
  let ucAgeingValue = 0;
  if (project.ucStatus === 'PENDING' || project.ucStatus === 'SUBMITTED') {
    const sanctionDate = new Date(project.sanctionDate);
    const ucAgeDays = daysBetween(sanctionDate, referenceDate);
    ucAgeingValue = Math.min(100, (ucAgeDays / 730) * 100); // 2 years = max
  }
  factors.push({
    name: 'pendingUCAgeing',
    weight: 0.10,
    value: Math.round(ucAgeingValue),
    maxValue: 100,
    description: `UC status: ${project.ucStatus}, ageing since sanction`,
  });

  // Calculate weighted score
  const score = Math.round(
    factors.reduce((sum, f) => sum + f.value * f.weight, 0)
  );

  let category: DelayRiskScoreResult['category'] = 'LOW';
  if (score >= 75 || mismatch.severity === 'CRITICAL') category = 'CRITICAL';
  else if (score >= 50) category = 'HIGH';
  else if (score >= 25) category = 'MEDIUM';

  // Statutory action based on score and factors
  let statutoryAction = 'Proceed with normal milestone monitoring.';
  if (mismatch.severity === 'CRITICAL') {
    statutoryAction = 'MANDATORY ACTION: Under Section 14(2), freeze fiscal bill releases and dispatch independent Third-Party Quality Assurance (TPQA) inspection.';
  } else if (mismatch.isMismatch) {
    statutoryAction = 'Issue 7-day show-cause notice to Executive Engineer and Contractor for financial-physical gap.';
  } else if (inspectionGapDays >= 60) {
    statutoryAction = 'Urgent geo-tagged photographic audit mandated for local Junior Engineer.';
  } else if (daysOverdue > 30) {
    statutoryAction = 'Expedite milestone completion; review contractor performance.';
  }

  return { score, category, factors, statutoryAction };
}

// ============================================
// RULE 4: CALCULATE EVIDENCE SCORE (0-100)
// ============================================

/**
 * Combines:
 * - Geo-tagged photo recency (0-40)
 * - Milestone certification (0-30)
 * - Citizen reports (0-20)
 * - UC status (0-10)
 */
export function calculateEvidenceScore(
  project: ProjectWork,
  inspections: FieldInspection[],
  milestones: PhysicalMilestone[],
  citizenReports: Grievance[],
  referenceDate: Date = new Date()
): EvidenceScoreResult {
  const components: EvidenceScoreComponent = {
    geoTaggedPhotoRecency: 0,
    milestoneCertification: 0,
    citizenReports: 0,
    ucStatus: 0,
  };

  // 1. Geo-tagged Photo Recency (0-40)
  let mostRecentPhotoDate: Date | null = null;
  for (const insp of inspections) {
    if (insp.photoPath && insp.exifTimestamp) {
      const d = new Date(insp.exifTimestamp);
      if (!mostRecentPhotoDate || d > mostRecentPhotoDate) {
        mostRecentPhotoDate = d;
      }
    }
  }

  if (mostRecentPhotoDate) {
    const photoAgeDays = daysBetween(mostRecentPhotoDate, referenceDate);
    if (photoAgeDays <= 7) components.geoTaggedPhotoRecency = 40;
    else if (photoAgeDays <= 14) components.geoTaggedPhotoRecency = 35;
    else if (photoAgeDays <= 30) components.geoTaggedPhotoRecency = 30;
    else if (photoAgeDays <= 60) components.geoTaggedPhotoRecency = 20;
    else if (photoAgeDays <= 90) components.geoTaggedPhotoRecency = 10;
    else components.geoTaggedPhotoRecency = 5;
  }

  // 2. Milestone Certification (0-30)
  const verifiedMilestones = milestones.filter(m => m.verified).length;
  const totalMilestones = milestones.length;
  if (totalMilestones > 0) {
    const verifiedRatio = verifiedMilestones / totalMilestones;
    components.milestoneCertification = Math.round(verifiedRatio * 30);
  } else if (project.physicalCompletionPct >= 100) {
    components.milestoneCertification = 15; // Completed but no milestone records
  }

  // 3. Citizen Reports (0-20)
  const relevantReports = citizenReports.filter(r => r.projectWorkId === project.id);
  const underReviewReports = relevantReports.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'ACTION_REQUIRED').length;
  const resolvedReports = relevantReports.filter(r => r.status === 'RESOLVED').length;
  if (relevantReports.length > 0) {
    // Penalty for unresolved reports, bonus for resolved
    components.citizenReports = Math.max(0, 15 - underReviewReports * 5 + resolvedReports * 3);
    components.citizenReports = Math.min(20, components.citizenReports);
  } else {
    components.citizenReports = 10; // Neutral - no reports
  }

  // 4. UC Status (0-10)
  switch (project.ucStatus) {
    case 'VERIFIED':
      components.ucStatus = 10;
      break;
    case 'SUBMITTED':
      components.ucStatus = 7;
      break;
    case 'PENDING':
      components.ucStatus = 3;
      break;
    case 'REJECTED':
      components.ucStatus = 0;
      break;
    default:
      components.ucStatus = 5;
  }

  const score = Math.round(
    components.geoTaggedPhotoRecency +
    components.milestoneCertification +
    components.citizenReports +
    components.ucStatus
  );

  let verdict: EvidenceScoreResult['verdict'] = 'INSUFFICIENT';
  if (score >= 80) verdict = 'STRONG';
  else if (score >= 60) verdict = 'ADEQUATE';
  else if (score >= 40) verdict = 'WEAK';

  return { score, components, verdict };
}

// ============================================
// RULE 5: DETECT DUPLICATE OR GHOST ASSETS
// ============================================

/**
 * Flags works within 150m GPS radius with:
 * - Similar names (fuzzy match)
 * - Repeated contractor
 * - Duplicate UC reference
 */
export function detectDuplicateOrGhostAssets(
  target: {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    contractor: string | null;
    ucReference?: string | null;
  },
  pool: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    contractor: string | null;
    ucReference?: string | null;
  }>
): DuplicateDetectionResult {
  const matches: DuplicateMatch[] = [];

  for (const item of pool) {
    if (item.id === target.id) continue;

    const distance = calculateDistanceMeters(target.latitude, target.longitude, item.latitude, item.longitude);

    if (distance <= 150) {
      // Check same contractor
      if (target.contractor && item.contractor &&
          target.contractor.toLowerCase() === item.contractor.toLowerCase()) {
        matches.push({
          projectId: item.id,
          distanceMeters: Math.round(distance),
          matchReason: 'proximity_same_contractor',
          title: item.title,
          contractor: item.contractor,
        });
        continue;
      }

      // Check similar name (simple word overlap)
      const targetWords = target.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const itemWords = item.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const commonWords = targetWords.filter(w => itemWords.includes(w));
      if (commonWords.length >= 2) {
        matches.push({
          projectId: item.id,
          distanceMeters: Math.round(distance),
          matchReason: 'proximity_similar_name',
          title: item.title,
          contractor: item.contractor,
        });
        continue;
      }

      // Check duplicate UC reference
      if (target.ucReference && item.ucReference &&
          target.ucReference === item.ucReference) {
        matches.push({
          projectId: item.id,
          distanceMeters: Math.round(distance),
          matchReason: 'duplicate_uc_reference',
          title: item.title,
          contractor: item.contractor,
        });
      }
    }
  }

  return {
    isDuplicate: matches.length > 0,
    matches,
    reason: matches.length > 0
      ? `Detected ${matches.length} potential duplicate/ghost asset(s) within 150m radius.`
      : undefined,
  };
}

// ============================================
// RULE 6: CALCULATE EQUITY LENS
// ============================================

/**
 * Aggregates funding and functional asset delivery across
 * remote blocks and Sixth Schedule ADCs (BTC, KAAC, DHAC).
 */
export function calculateEquityLens(projects: ProjectWork[]): EquityLensResult {
  const byAdcArea: Record<string, EquityLensByArea> = {};

  // Group by ADC area
  for (const project of projects) {
    const adcKey = project.adcArea || 'Non-ADC';
    if (!byAdcArea[adcKey]) {
      byAdcArea[adcKey] = {
        totalFunding: 0,
        totalPhysicalDelivery: 0,
        projectCount: 0,
        avgFundingPerProject: 0,
        avgPhysicalDeliveryPerProject: 0,
        underservedBlocks: [],
      };
    }

    byAdcArea[adcKey].totalFunding += project.financialSanction;
    byAdcArea[adcKey].totalPhysicalDelivery += project.physicalCompletionPct;
    byAdcArea[adcKey].projectCount += 1;
  }

  // Calculate averages
  for (const [area, data] of Object.entries(byAdcArea)) {
    data.avgFundingPerProject = data.projectCount > 0
      ? Math.round((data.totalFunding / data.projectCount) * 100) / 100
      : 0;
    data.avgPhysicalDeliveryPerProject = data.projectCount > 0
      ? Math.round((data.totalPhysicalDelivery / data.projectCount) * 10) / 10
      : 0;

    // Identify underserved blocks (low delivery, low funding)
    const areaProjects = projects.filter(p => (p.adcArea || 'Non-ADC') === area);
    const blockMap = new Map<string, { funding: number; delivery: number; count: number }>();
    for (const p of areaProjects) {
      const key = p.block || 'Unknown';
      if (!blockMap.has(key)) blockMap.set(key, { funding: 0, delivery: 0, count: 0 });
      const b = blockMap.get(key)!;
      b.funding += p.financialSanction;
      b.delivery += p.physicalCompletionPct;
      b.count += 1;
    }
    for (const [block, b] of blockMap.entries()) {
      const avgDelivery = b.delivery / b.count;
      const avgFunding = b.funding / b.count;
      // Underserved: below median delivery AND below median funding
      if (avgDelivery < 50 && avgFunding < 5) { // 50% physical, 5Cr funding
        data.underservedBlocks.push(block);
      }
    }
  }

  // Calculate Equity Index (0-100)
  // Based on Gini coefficient of funding distribution across ADC areas
  const areas = Object.values(byAdcArea).filter(a => a.projectCount > 0);
  if (areas.length <= 1) {
    return { byAdcArea, equityIndex: 100, underservedBlocks: [], recommendations: ['Only one ADC area represented'] };
  }

  const fundingPerProject = areas.map(a => a.avgFundingPerProject).sort((a, b) => a - b);
  const n = fundingPerProject.length;
  let giniSum = 0;
  for (let i = 0; i < n; i++) {
    giniSum += (2 * (i + 1) - n - 1) * fundingPerProject[i];
  }
  const gini = giniSum / (n * fundingPerProject.reduce((a, b) => a + b, 0));
  const equityIndex = Math.round((1 - Math.abs(gini)) * 100);

  // Collect all underserved blocks
  const allUnderserved = Object.values(byAdcArea).flatMap(a => a.underservedBlocks);

  // Generate recommendations
  const recommendations: string[] = [];
  if (equityIndex < 60) {
    recommendations.push('Significant funding disparity detected across ADC areas. Prioritize allocation to underserved Sixth Schedule areas.');
  }
  if (byAdcArea['BTC']?.avgPhysicalDeliveryPerProject < 50) {
    recommendations.push('BTC area shows low physical delivery. Review contractor capacity and fund flow.');
  }
  if (byAdcArea['KAAC']?.avgPhysicalDeliveryPerProject < 50) {
    recommendations.push('KAAC area shows low physical delivery. Review contractor capacity and fund flow.');
  }
  if (byAdcArea['DHAC']?.avgPhysicalDeliveryPerProject < 50) {
    recommendations.push('DHAC area shows low physical delivery. Review contractor capacity and fund flow.');
  }
  if (allUnderserved.length > 0) {
    recommendations.push(`Underserved blocks identified: ${allUnderserved.join(', ')}. Target special packages.`);
  }

  return { byAdcArea, equityIndex, underservedBlocks: allUnderserved, recommendations };
}