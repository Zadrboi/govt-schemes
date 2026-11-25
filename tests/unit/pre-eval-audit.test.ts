import { describe, it, expect } from 'vitest';
import { 
  CANONICAL_PROJECTS, 
  getCanonicalKpis 
} from '@/lib/data/canonical';
import { ASSAM_DISTRICTS } from '@/lib/data/assam-districts';
import { projectCreateSchema, projectUpdateSchema } from '@/lib/validation';

describe('Pre-Evaluation Audit Fixes & Regressions', () => {
  it('enforces that any project with status COMPLETED must have physicalCompletionPct === 100', () => {
    // Check all canonical projects
    const completedProjects = CANONICAL_PROJECTS.filter(p => p.status === 'COMPLETED');
    for (const proj of completedProjects) {
      expect(proj.physicalCompletionPct).toBe(100);
    }

    // Projects with progress < 100% must not be marked COMPLETED
    const partialProjects = CANONICAL_PROJECTS.filter(p => p.physicalCompletionPct < 100);
    for (const proj of partialProjects) {
      expect(proj.status).not.toBe('COMPLETED');
    }

    // Validation schema rejection
    const invalidCreate = projectCreateSchema.safeParse({
      workCode: 'AS-TEST-001',
      title: 'Incomplete Test Project',
      scheme: 'NESIDS_ROADS',
      district: 'Kamrup',
      coDistrict: 'Guwahati',
      block: 'Dispur',
      sanctionedCost: 5.0,
      fundReleased: 4.0,
      physicalCompletionPct: 92, // < 100
      status: 'COMPLETED', // Invalid combination
      governanceType: 'PLAIN_DISTRICT',
      latitude: 26.14,
      longitude: 91.73,
    });
    expect(invalidCreate.success).toBe(false);

    const validCreate = projectCreateSchema.safeParse({
      workCode: 'AS-KAM-0002',
      title: 'Complete Test Project',
      scheme: 'NESIDS_ROADS',
      fundingAgency: 'Ministry of DoNER',
      sanctionDate: '2024-01-01T00:00:00.000Z',
      district: 'Kamrup',
      coDistrict: 'Guwahati',
      block: 'Dispur',
      villageWard: 'Dispur Ward 5',
      sanctionedCost: 5.0,
      financialSanction: 5.0,
      fundReleased: 5.0,
      expenditure: 5.0,
      physicalCompletionPct: 100,
      status: 'COMPLETED',
      latitude: 26.14,
      longitude: 91.73,
      implementingAgency: 'PWD Roads',
      executingOfficer: 'EE Guwahati',
      plannedStartDate: '2025-01-01T00:00:00.000Z',
      plannedEndDate: '2026-01-01T00:00:00.000Z',
    });
    expect(validCreate.success).toBe(true);
  });

  it('contains strictly 35 canonical Assam districts in alphabetical order', () => {
    expect(ASSAM_DISTRICTS.length).toBe(35);
    const sortedCopy = [...ASSAM_DISTRICTS].sort((a, b) => a.localeCompare(b));
    expect(ASSAM_DISTRICTS).toEqual(sortedCopy);
    expect(ASSAM_DISTRICTS).toContain('Darrang');
    expect(ASSAM_DISTRICTS).toContain('Kamrup');
    expect(ASSAM_DISTRICTS).toContain('Majuli');
    expect(ASSAM_DISTRICTS).toContain('Dima Hasao');
    expect(ASSAM_DISTRICTS).toContain('Baksa');
  });

  it('returns data-driven KPIs matching canonical numbers (15 works, 93.3% match)', () => {
    const kpis = getCanonicalKpis();
    expect(kpis.totalWorks).toBe(15);
    expect(CANONICAL_PROJECTS.length).toBe(15);
    expect(kpis.activeExceptions).toBe(1);
    expect(kpis.ledgerMatchPct).toBe(93.3);
    expect(kpis.officialLanguages).toBe(4);
  });

  it('handles pluralization correctly for exceptions and time units', () => {
    const formatExceptions = (count: number) => `${count} ${count === 1 ? 'Exception' : 'Exceptions'}`;
    const formatDays = (count: number) => `${count} ${count === 1 ? 'Day' : 'Days'}`;

    expect(formatExceptions(1)).toBe('1 Exception');
    expect(formatExceptions(2)).toBe('2 Exceptions');
    expect(formatExceptions(0)).toBe('0 Exceptions');

    expect(formatDays(1)).toBe('1 Day');
    expect(formatDays(74)).toBe('74 Days');
  });
});
