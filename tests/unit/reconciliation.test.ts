import { describe, it, expect } from 'vitest';
import { evaluateProjectAudit, detectDuplicateAsset } from '@/lib/intelligence/reconciliation';

describe('Intelligence Layer: evaluateProjectAudit()', () => {
  it('flags expenditure gap when financial progress exceeds physical by >= 15%', () => {
    const result = evaluateProjectAudit({
      id: 'AS-DAR-0821',
      financialProgressPct: 80.0,
      verifiedPhysicalProgressPct: 35.0,
      lastInspectionDate: new Date('2026-01-15T00:00:00Z'),
    });

    expect(result.varianceGapPct).toBe(45.0);
    expect(result.isVarianceFlagged).toBe(true);
    expect(result.riskCategory).toBe('CRITICAL');
    expect(result.statutoryAction).toContain('freeze fiscal bill releases');
  });

  it('recognizes healthy project within normal tolerances', () => {
    const result = evaluateProjectAudit({
      id: 'AS-KAM-1049',
      financialProgressPct: 65.0,
      verifiedPhysicalProgressPct: 68.0,
      lastInspectionDate: new Date(),
      delayDays: 0,
    });

    expect(result.isVarianceFlagged).toBe(false);
    expect(result.isStalled).toBe(false);
    expect(result.riskCategory).toBe('LOW');
    expect(result.evidenceScore).toBeGreaterThanOrEqual(80);
  });

  it('detects duplicate or ghost assets in close geographical radius', () => {
    const target = {
      id: 'NEW-001',
      latitude: 26.4352,
      longitude: 91.8841,
      title: 'Water Supply Pipeline Extension',
      contractor: 'M/s Brahmaputra Infra-Engg Ltd',
    };

    const existingPool = [
      {
        id: 'AS-DAR-0821',
        latitude: 26.4353, // ~15m away
        longitude: 91.8842,
        title: 'Sipajhar Water Scheme',
        contractor: 'M/s Brahmaputra Infra-Engg Ltd',
      },
      {
        id: 'OTHER-999',
        latitude: 26.5000,
        longitude: 92.0000,
        title: 'Far away project',
        contractor: 'Different Contractor',
      },
    ];

    const duplicateCheck = detectDuplicateAsset(target, existingPool);
    expect(duplicateCheck.isDuplicateCandidate).toBe(true);
    expect(duplicateCheck.duplicateMatches).toContain('AS-DAR-0821');
  });
});
