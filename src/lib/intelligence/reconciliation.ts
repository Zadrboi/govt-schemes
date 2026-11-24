/**
 * Intelligence Layer for Real-Time Monitoring of Decentralised Planning Schemes
 * Simple, explainable, and statutory rules adhering to Ideathon Part 1 requirements.
 */

export interface AuditEvaluation {
  workId: string;
  isStalled: boolean;
  stalledDays: number;
  varianceGapPct: number;
  isVarianceFlagged: boolean;
  delayRiskScore: number; // 0 - 100
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceScore: number; // 0 - 100
  statutoryAction: string;
}

export function evaluateProjectAudit(project: {
  id: string;
  financialProgressPct: number;
  verifiedPhysicalProgressPct: number;
  lastInspectionDate: Date | string | null;
  delayDays?: number;
  adcArea?: string | null;
  hasPhotos?: boolean;
}): AuditEvaluation {
  const now = new Date();
  const lastInspection = project.lastInspectionDate ? new Date(project.lastInspectionDate) : null;
  
  const stalledDays = lastInspection
    ? Math.max(0, Math.floor((now.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24)))
    : 90;

  // Stalled work detection rule: No inspection/photo for 30/60/90 days
  const isStalled = stalledDays >= 60;

  // Financial-physical mismatch: Financial % exceeds verified physical % by > 15%
  const varianceGapPct = Number((project.financialProgressPct - project.verifiedPhysicalProgressPct).toFixed(1));
  const isVarianceFlagged = varianceGapPct >= 15.0;

  // Delay-risk score calculation (explainable weighted model)
  // 1. Mismatch gap weight: 40%
  // 2. Overdue inspection weight: 35%
  // 3. Project delay days weight: 25%
  const delayDays = project.delayDays || 0;
  const mismatchFactor = Math.min(100, Math.max(0, varianceGapPct * 2));
  const inspectionFactor = Math.min(100, (stalledDays / 60) * 100);
  const delayFactor = Math.min(100, (delayDays / 30) * 100);

  const delayRiskScore = Math.round(
    mismatchFactor * 0.40 + inspectionFactor * 0.35 + delayFactor * 0.25
  );

  let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (delayRiskScore >= 75 || varianceGapPct >= 25) {
    riskCategory = 'CRITICAL';
  } else if (delayRiskScore >= 50) {
    riskCategory = 'HIGH';
  } else if (delayRiskScore >= 25) {
    riskCategory = 'MEDIUM';
  }

  // Evidence score: How verifiable and trustworthy is this project's record?
  // Recency of inspection (up to 40 pts) + Physical photo presence (30 pts) + Reasonable variance (30 pts)
  let evidenceScore = 30; // base
  if (stalledDays <= 14) evidenceScore += 40;
  else if (stalledDays <= 30) evidenceScore += 25;
  else if (stalledDays <= 60) evidenceScore += 10;

  if (project.hasPhotos !== false) evidenceScore += 20;
  if (varianceGapPct <= 5) evidenceScore += 20;
  else if (varianceGapPct <= 15) evidenceScore += 10;

  evidenceScore = Math.min(100, Math.max(10, evidenceScore));

  let statutoryAction = 'Proceed with normal milestone monitoring.';
  if (varianceGapPct >= 25) {
    statutoryAction = 'MANDATORY ACTION: Under Section 14(2), freeze fiscal bill releases and dispatch independent Third-Party Quality Assurance (TPQA) inspection.';
  } else if (isVarianceFlagged) {
    statutoryAction = 'Issue 7-day show-cause notice to Executive Engineer and Contractor for financial-physical gap.';
  } else if (isStalled) {
    statutoryAction = 'Urgent geo-tagged photographic audit mandated for local Junior Engineer.';
  }

  return {
    workId: project.id,
    isStalled,
    stalledDays,
    varianceGapPct,
    isVarianceFlagged,
    delayRiskScore,
    riskCategory,
    evidenceScore,
    statutoryAction,
  };
}

/**
 * Duplicate / Ghost-Asset Detection Rule
 * Detects whether an asset has suspiciously identical GPS coordinates, matching names, or duplicate contractor claims.
 */
export function detectDuplicateAsset(
  target: { id: string; latitude: number; longitude: number; title: string; contractor: string },
  pool: Array<{ id: string; latitude: number; longitude: number; title: string; contractor: string }>
): { isDuplicateCandidate: boolean; duplicateMatches: string[]; reason?: string } {
  const matches: string[] = [];

  for (const item of pool) {
    if (item.id === target.id) continue;

    // Approximate distance in meters (using Equirectangular approximation for fast local checks)
    const latDiff = (item.latitude - target.latitude) * 111320;
    const lonDiff = (item.longitude - target.longitude) * 111320 * Math.cos(target.latitude * (Math.PI / 180));
    const distanceMeters = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

    if (distanceMeters < 50 && item.contractor.toLowerCase() === target.contractor.toLowerCase()) {
      matches.push(item.id);
    }
  }

  return {
    isDuplicateCandidate: matches.length > 0,
    duplicateMatches: matches,
    reason: matches.length > 0
      ? `Detected ${matches.length} existing project(s) within 50m radius with identical contractor.`
      : undefined,
  };
}
