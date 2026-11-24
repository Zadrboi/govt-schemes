import { describe, it, expect } from 'vitest';
import { 
  CANONICAL_SCHEMES, 
  CANONICAL_PROJECTS, 
  CANONICAL_EVENTS, 
  CANONICAL_NOTICES, 
  CANONICAL_GRIEVANCES 
} from '@/lib/data/canonical';
import { evaluateProjectAudit } from '@/lib/intelligence/reconciliation';

describe('Part 1 & 2 Alignment: Canonical Data & Statutory Intelligence', () => {
  it('covers all 11 required decentralized schemes for Assam/NER', () => {
    const requiredSchemes = [
      'NESIDS_ROADS',
      'NESIDS_OTRI',
      'NEC',
      'PM_DEVINE',
      'SDP',
      'MLAADS',
      'SUHRID',
      'UNTIED_FUNDS',
      'ASSAM_DARSHAN',
      'AAGY',
      'NATIONAL_JJM_PMGSY_CUSTOM'
    ];

    const presentCodes = CANONICAL_SCHEMES.map(s => s.code);
    for (const req of requiredSchemes) {
      expect(presentCodes).toContain(req);
    }
    expect(CANONICAL_SCHEMES.length).toBeGreaterThanOrEqual(11);
  });

  it('contains the signature flagship demo scenario (AS-DAR-0821 Sipajhar WSS)', () => {
    const flagship = CANONICAL_PROJECTS.find(p => p.workCode === 'AS-DAR-0821');
    expect(flagship).toBeDefined();
    expect(flagship?.district).toBe('Darrang');
    expect(flagship?.coDistrict).toBe('Sipajhar');
    expect(flagship?.sanctionedCost).toBe(11.0);
    expect(flagship?.fundReleased).toBe(8.8); // 80% disbursed
    expect(flagship?.physicalCompletionPct).toBe(35); // 35% physical
    expect(flagship?.daysSinceLastInspection).toBe(74); // 74-day stalled
    expect(flagship?.status).toBe('STALLED');
  });

  it('correctly models Sixth Schedule Autonomous District Councils (ADCs)', () => {
    const adcProjects = CANONICAL_PROJECTS.filter(p => p.governanceType === 'SIXTH_SCHEDULE_ADC');
    expect(adcProjects.length).toBeGreaterThan(0);

    const councils = new Set(adcProjects.map(p => p.adcArea));
    expect(councils.has('BTC')).toBe(true);
    expect(councils.has('KAAC')).toBe(true);
    expect(councils.has('NCHAC')).toBe(true);
  });

  it('provides multi-category event-driven activity ledger entries', () => {
    const categories = new Set(CANONICAL_EVENTS.map((e: any) => e.type || e.category));
    expect(categories.has('FIELD')).toBe(true);
    expect(categories.has('FINANCIAL')).toBe(true);
    expect(categories.has('ADMINISTRATIVE')).toBe(true);
    expect(categories.has('CITIZEN')).toBe(true);
    expect(categories.has('SYSTEM')).toBe(true);
  });

  it('generates compliant citizen grievance ticket codes', () => {
    for (const g of CANONICAL_GRIEVANCES) {
      const ticket = g.ticketCode || (g as any).ticketNumber;
      expect(ticket).toMatch(/^DRI-GRV-2026-\d{4}$/);
    }
  });

  it('stalled & mismatch intelligence engine correctly flags AS-DAR-0821', () => {
    const flagship = CANONICAL_PROJECTS.find(p => p.workCode === 'AS-DAR-0821')!;
    const finPct = (flagship.fundReleased / flagship.sanctionedCost) * 100;
    
    // Simulate 74 days ago inspection
    const pastDate = new Date(Date.now() - 74 * 24 * 60 * 60 * 1000);
    
    const audit = evaluateProjectAudit({
      id: flagship.id,
      financialProgressPct: finPct,
      verifiedPhysicalProgressPct: flagship.physicalCompletionPct,
      lastInspectionDate: pastDate,
      delayDays: 74,
    });

    expect(audit.isStalled).toBe(true);
    expect(audit.isVarianceFlagged).toBe(true);
    expect(audit.varianceGapPct).toBeGreaterThanOrEqual(15);
    expect(audit.delayRiskScore).toBeGreaterThanOrEqual(60);
    expect(audit.riskCategory).toMatch(/HIGH|CRITICAL/);
  });
});
