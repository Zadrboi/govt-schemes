import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectStalledWork,
  detectFinancialPhysicalMismatch,
  calculateDelayRiskScore,
  calculateEvidenceScore,
  detectDuplicateOrGhostAssets,
  calculateEquityLens,
} from '@/lib/intelligence/rules';

describe('Intelligence Engine - Pure Deterministic Rules', () => {
  const now = new Date('2026-03-24T12:00:00Z');
  const mockProjects = [
    {
      id: 'AS-DAR-0821',
      workCode: 'AS-DAR-0821',
      title: 'Sipajhar NESIDS-OTRI Water Supply',
      scheme: 'NESIDS_OTRI',
      fundingAgency: 'DoNER',
      sanctionDate: new Date('2024-01-15'),
      sanctionedCost: 11.0,
      revisedCost: 11.0,
      state: 'Assam',
      district: 'Darrang',
      coDistrict: 'Sipajhar',
      adcArea: null,
      block: 'Sipajhar Dev Block',
      villageWard: 'Sipajhar',
      latitude: 26.4352,
      longitude: 91.8841,
      implementingAgency: 'PHED Assam',
      contractor: 'M/s Brahmaputra Infra-Engg Ltd',
      executingOfficer: 'Pranjal Saikia',
      technicalSanctionRef: 'TS-2024-001',
      plannedStartDate: new Date('2024-02-01'),
      plannedEndDate: new Date('2025-01-31'),
      actualStartDate: new Date('2024-02-15'),
      actualEndDate: null,
      physicalCompletionPct: 35.0,
      financialSanction: 11.0,
      fundReleased: 8.8,
      expenditure: 8.8,
      ucStatus: 'PENDING',
      pendingAmount: 2.2,
      lastInspectionDate: new Date('2026-01-15T10:30:00Z'), // 69 days ago
      outcomeIndicators: 'Households served: 1250',
      imagePath: '/images/015.jpg',
      status: 'IN_PROGRESS',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: 'AS-KAM-1049',
      workCode: 'AS-KAM-1049',
      title: 'Rangia Cold-Storage & Solar Microgrid',
      scheme: 'PM_DEVINE',
      fundingAgency: 'MNRE',
      sanctionDate: new Date('2024-06-01'),
      sanctionedCost: 6.5,
      revisedCost: 6.5,
      state: 'Assam',
      district: 'Kamrup Rural',
      coDistrict: 'Rangia',
      adcArea: null,
      block: 'Rangia Central',
      villageWard: 'Rangia',
      latitude: 26.4687,
      longitude: 91.6247,
      implementingAgency: 'AEDCL',
      contractor: 'M/s GreenEnergy Assam Pvt Ltd',
      executingOfficer: 'Dr. Himashree Sarma',
      technicalSanctionRef: 'TS-2024-002',
      plannedStartDate: new Date('2024-07-01'),
      plannedEndDate: new Date('2025-06-30'),
      actualStartDate: new Date('2024-07-15'),
      actualEndDate: null,
      physicalCompletionPct: 68.0,
      financialSanction: 6.5,
      fundReleased: 4.2,
      expenditure: 4.2,
      ucStatus: 'SUBMITTED',
      pendingAmount: 2.3,
      lastInspectionDate: new Date('2026-03-18T14:00:00Z'), // 6 days ago
      outcomeIndicators: 'Cold storage capacity: 500MT',
      imagePath: '/images/021.jpg',
      status: 'IN_PROGRESS',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2026-03-18'),
    },
    {
      id: 'AS-BTC-0412',
      workCode: 'AS-BTC-0412',
      title: 'Kokrajhar Flood Shelter & Embankment',
      scheme: 'SDP',
      fundingAgency: 'State Govt',
      sanctionDate: new Date('2024-03-01'),
      sanctionedCost: 6.2,
      revisedCost: 6.2,
      state: 'Assam',
      district: 'Kokrajhar',
      coDistrict: 'Kokrajhar Sadar',
      adcArea: 'BTC',
      block: 'Dotma Development Block',
      villageWard: 'Dotma',
      latitude: 26.4012,
      longitude: 90.2715,
      implementingAgency: 'BTC PWD',
      contractor: 'M/s Bodoland Construct Co.',
      executingOfficer: 'B. Basumatary',
      technicalSanctionRef: 'TS-2024-003',
      plannedStartDate: new Date('2024-04-01'),
      plannedEndDate: new Date('2025-03-31'),
      actualStartDate: new Date('2024-04-15'),
      actualEndDate: null,
      physicalCompletionPct: 45.0,
      financialSanction: 6.2,
      fundReleased: 3.1,
      expenditure: 3.1,
      ucStatus: 'SUBMITTED',
      pendingAmount: 3.1,
      lastInspectionDate: new Date('2026-02-28T11:00:00Z'), // 24 days ago
      outcomeIndicators: 'Shelter capacity: 2000 people',
      imagePath: '/images/007.jpg',
      status: 'IN_PROGRESS',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2026-02-28'),
    },
    {
      id: 'AS-MAJ-0301',
      workCode: 'AS-MAJ-0301',
      title: 'Majuli Flood Embankment & Feeder Road',
      scheme: 'NESIDS_ROADS',
      fundingAgency: 'DoNER',
      sanctionDate: new Date('2023-12-01'),
      sanctionedCost: 18.5,
      revisedCost: 18.5,
      state: 'Assam',
      district: 'Majuli',
      coDistrict: 'Garamur',
      adcArea: null,
      block: 'Ujani Majuli Block',
      villageWard: 'Garamur',
      latitude: 26.9621,
      longitude: 94.2185,
      implementingAgency: 'PWD Majuli',
      contractor: 'M/s Assam Riverine Works Ltd',
      executingOfficer: 'K. N. Hazarika',
      technicalSanctionRef: 'TS-2023-001',
      plannedStartDate: new Date('2024-01-01'),
      plannedEndDate: new Date('2024-12-31'),
      actualStartDate: new Date('2024-01-15'),
      actualEndDate: null,
      physicalCompletionPct: 82.5,
      financialSanction: 18.5,
      fundReleased: 14.8,
      expenditure: 14.8,
      ucStatus: 'VERIFIED',
      pendingAmount: 3.7,
      lastInspectionDate: new Date('2026-03-12T09:15:00Z'), // 12 days ago
      outcomeIndicators: 'Embankment length: 15km',
      imagePath: '/images/001.jpg',
      status: 'IN_PROGRESS',
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2026-03-12'),
    },
    {
      id: 'AS-DUB-0902',
      workCode: 'AS-DUB-0902',
      title: 'Dhubri-Phulbari Mega Bridge Approach Roads',
      scheme: 'NESIDS_ROADS',
      fundingAgency: 'NHAI',
      sanctionDate: new Date('2024-02-01'),
      sanctionedCost: 450.0,
      revisedCost: 450.0,
      state: 'Assam',
      district: 'Dhubri',
      coDistrict: 'Bilasipara',
      adcArea: null,
      block: 'Gauripur Block',
      villageWard: 'Bilasipara',
      latitude: 26.0208,
      longitude: 89.9749,
      implementingAgency: 'NHAI RO Guwahati',
      contractor: 'M/s L&T Infrastructure Engineering',
      executingOfficer: 'S. K. Verma',
      technicalSanctionRef: 'TS-2024-004',
      plannedStartDate: new Date('2024-03-01'),
      plannedEndDate: new Date('2026-02-28'),
      actualStartDate: new Date('2024-03-15'),
      actualEndDate: null,
      physicalCompletionPct: 62.0,
      financialSanction: 450.0,
      fundReleased: 310.0,
      expenditure: 310.0,
      ucStatus: 'SUBMITTED',
      pendingAmount: 140.0,
      lastInspectionDate: new Date('2026-03-01T10:00:00Z'), // 23 days ago
      outcomeIndicators: 'Approach road length: 8km',
      imagePath: '/images/006.jpg',
      status: 'IN_PROGRESS',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2026-03-01'),
    },
  ];

  const mockMilestones = {
    'AS-DAR-0821': [
      { id: 'm1', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-DAR-0821', name: 'Intake Well', notes: null, plannedDate: new Date('2024-03-01'), actualDate: new Date('2024-05-15'), completionPct: 100, verified: true, verifiedBy: 'officer1', verifiedAt: new Date('2024-05-15') },
      { id: 'm2', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-DAR-0821', name: 'Pipeline Phase 1', notes: null, plannedDate: new Date('2024-08-01'), actualDate: null, completionPct: 60, verified: false, verifiedBy: null, verifiedAt: null },
    ],
    'AS-KAM-1049': [
      { id: 'm3', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-KAM-1049', name: 'Civil Works', notes: null, plannedDate: new Date('2024-07-01'), actualDate: new Date('2024-12-01'), completionPct: 100, verified: true, verifiedBy: 'officer2', verifiedAt: new Date('2024-12-01') },
    ],
    'AS-MAJ-0301': [
      { id: 'm4', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-MAJ-0301', name: 'Embankment Construction', notes: null, plannedDate: new Date('2024-02-01'), actualDate: new Date('2024-10-01'), completionPct: 100, verified: true, verifiedBy: 'officer3', verifiedAt: new Date('2024-10-01') },
      { id: 'm5', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-MAJ-0301', name: 'Feeder Road', notes: null, plannedDate: new Date('2024-05-01'), actualDate: new Date('2024-11-15'), completionPct: 100, verified: true, verifiedBy: 'officer3', verifiedAt: new Date('2024-11-15') },
    ],
  };

  const mockInspections = {
    'AS-DAR-0821': [
      { id: 'i1', createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'), projectWorkId: 'AS-DAR-0821', officerId: 'officer1', gpsLat: 26.4352, gpsLng: 91.8841, photoPath: '/images/015.jpg', exifTimestamp: new Date('2026-01-15T10:30:00Z'), qualityFlagsJson: '{"stalledWork":true}', notes: null, offlineClientId: 'client1' },
    ],
    'AS-KAM-1049': [
      { id: 'i2', createdAt: new Date('2026-03-18'), updatedAt: new Date('2026-03-18'), projectWorkId: 'AS-KAM-1049', officerId: 'officer2', gpsLat: 26.4687, gpsLng: 91.6247, photoPath: '/images/021.jpg', exifTimestamp: new Date('2026-03-18T14:00:00Z'), qualityFlagsJson: '{"onTrack":true}', notes: null, offlineClientId: 'client2' },
    ],
    'AS-BTC-0412': [
      { id: 'i3', createdAt: new Date('2026-02-28'), updatedAt: new Date('2026-02-28'), projectWorkId: 'AS-BTC-0412', officerId: 'officer3', gpsLat: 26.4012, gpsLng: 90.2715, photoPath: '/images/007.jpg', exifTimestamp: new Date('2026-02-28T11:00:00Z'), qualityFlagsJson: '{"onTrack":true}', notes: null, offlineClientId: 'client3' },
    ],
    'AS-MAJ-0301': [
      { id: 'i4', createdAt: new Date('2026-03-12'), updatedAt: new Date('2026-03-12'), projectWorkId: 'AS-MAJ-0301', officerId: 'officer3', gpsLat: 26.9621, gpsLng: 94.2185, photoPath: '/images/001.jpg', exifTimestamp: new Date('2026-03-12T09:15:00Z'), qualityFlagsJson: '{"onTrack":true}', notes: null, offlineClientId: 'client4' },
    ],
    'AS-DUB-0902': [
      { id: 'i5', createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-03-01'), projectWorkId: 'AS-DUB-0902', officerId: 'officer4', gpsLat: 26.0208, gpsLng: 89.9749, photoPath: '/images/006.jpg', exifTimestamp: new Date('2026-03-01T10:00:00Z'), qualityFlagsJson: '{"onTrack":true}', notes: null, offlineClientId: 'client5' },
    ],
  };

  describe('detectStalledWork', () => {
    it('should flag AS-DAR-0821 as stalled (68 days > 60 threshold)', () => {
      const result = detectStalledWork(mockProjects[0], mockMilestones['AS-DAR-0821'], mockInspections['AS-DAR-0821'], now);
      expect(result.isStalled).toBe(true);
      expect(result.stalledDays).toBe(68);
      expect(result.threshold).toBe(60);
      expect(result.severity).toBe('HIGH');
    });

    it('should not flag AS-KAM-1049 (5 days < 30 threshold)', () => {
      const result = detectStalledWork(mockProjects[1], mockMilestones['AS-KAM-1049'], mockInspections['AS-KAM-1049'], now);
      expect(result.isStalled).toBe(false);
      expect(result.stalledDays).toBe(5);
      expect(result.severity).toBe('NONE');
    });

    it('should flag AS-BTC-0412 at NONE level (24 days < 30 threshold)', () => {
      const result = detectStalledWork(mockProjects[2], [], mockInspections['AS-BTC-0412'], now);
      expect(result.isStalled).toBe(false);
      expect(result.stalledDays).toBe(24);
      expect(result.severity).toBe('NONE');
    });

    it('should use milestone actualDate if more recent than inspection', () => {
      const project = { ...mockProjects[1], lastInspectionDate: new Date('2026-01-01') };
      const milestones = [{ id: 'm6', createdAt: new Date(), updatedAt: new Date(), projectWorkId: 'AS-KAM-1049', name: 'Test', notes: null, plannedDate: new Date('2024-01-01'), actualDate: new Date('2026-03-20'), completionPct: 100, verified: true, verifiedBy: 'officer2', verifiedAt: new Date('2026-03-20') }];
      const result = detectStalledWork(project, milestones, [], now);
      expect(result.stalledDays).toBeLessThan(10);
    });

    it('should return max severity (90+) when no inspections or milestones exist', () => {
      const project = { ...mockProjects[0], lastInspectionDate: null };
      const result = detectStalledWork(project, [], [], now);
      expect(result.isStalled).toBe(true);
      expect(result.stalledDays).toBeGreaterThanOrEqual(90);
      expect(result.severity).toBe('CRITICAL');
    });
  });

  describe('detectFinancialPhysicalMismatch', () => {
    it('should flag AS-DAR-0821 with 45% variance (80% financial vs 35% physical)', () => {
      const result = detectFinancialPhysicalMismatch(mockProjects[0]);
      expect(result.isMismatch).toBe(true);
      expect(result.financialPct).toBeCloseTo(80, 0);
      expect(result.physicalPct).toBe(35);
      expect(result.varianceGapPct).toBe(45);
      expect(result.severity).toBe('CRITICAL');
    });

    it('should not flag AS-MAJ-0301 (80% financial vs 82.5% physical = -2.5% variance)', () => {
      const result = detectFinancialPhysicalMismatch(mockProjects[3]);
      expect(result.isMismatch).toBe(false);
      expect(result.varianceGapPct).toBeLessThan(0);
      expect(result.severity).toBe('NONE');
    });

    it('should flag high physical + zero expenditure', () => {
      const project = { ...mockProjects[1], physicalCompletionPct: 90, fundReleased: 0, expenditure: 0 };
      const result = detectFinancialPhysicalMismatch(project);
      expect(result.isMismatch).toBe(true);
      expect(result.severity).toBe('HIGH');
    });

    it('should use 20% threshold for variance detection', () => {
      const project = { ...mockProjects[1], physicalCompletionPct: 50, fundReleased: 4.2, expenditure: 4.2, financialSanction: 6.5 };
      // 4.2/6.5 = 64.6% financial vs 50% physical = 14.6% gap (below 20%)
      const result = detectFinancialPhysicalMismatch(project);
      expect(result.isMismatch).toBe(false);
    });

    it('should flag at exactly 20% threshold', () => {
      const project = { ...mockProjects[1], physicalCompletionPct: 44.6, fundReleased: 4.2, expenditure: 4.2, financialSanction: 6.5 };
      // 4.2/6.5 = 64.6% financial vs 44.6% physical = 20% gap
      const result = detectFinancialPhysicalMismatch(project);
      expect(result.isMismatch).toBe(true);
    });
  });

  describe('calculateDelayRiskScore', () => {
    it('should return CRITICAL for AS-DAR-0821 (high variance + stalled + overdue)', () => {
      const result = calculateDelayRiskScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], now);
      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(result.category).toBe('CRITICAL');
      expect(result.factors).toContainEqual(expect.objectContaining({ name: 'financialPhysicalMismatch' }));
      expect(result.factors).toContainEqual(expect.objectContaining({ name: 'inspectionGap' }));
    });

    it('should return LOW/MEDIUM for AS-MAJ-0301 (on track, low variance, recent inspection)', () => {
      const result = calculateDelayRiskScore(mockProjects[3], mockInspections['AS-MAJ-0301'], mockMilestones['AS-MAJ-0301'] || [], now);
      expect(result.score).toBeLessThan(30);
      expect(['LOW', 'MEDIUM']).toContain(result.category);
    });

    it('should include all 5 factor breakdowns', () => {
      const result = calculateDelayRiskScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], now);
      const factorNames = result.factors.map(f => f.name).sort();
      expect(factorNames).toContain('daysOverdue');
      expect(factorNames).toContain('inspectionGap');
      expect(factorNames).toContain('financialPhysicalMismatch');
      expect(factorNames).toContain('repeatContractorFlags');
      expect(factorNames).toContain('pendingUCAgeing');
    });

    it('should penalize repeat contractor across multiple stalled projects', () => {
      const projectsWithRepeatContractor = [
        mockProjects[0],
        { ...mockProjects[1], contractor: 'M/s Brahmaputra Infra-Engg Ltd', lastInspectionDate: new Date('2026-01-01') },
      ];
      const result = calculateDelayRiskScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], now, projectsWithRepeatContractor);
      const contractorFactor = result.factors.find(f => f.name === 'repeatContractorFlags');
      expect(contractorFactor?.value).toBeGreaterThan(0);
    });

    it('should penalize pending UC ageing', () => {
      const project = { ...mockProjects[0], ucStatus: 'PENDING', sanctionDate: new Date('2024-01-15') };
      const result = calculateDelayRiskScore(project, mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], now);
      const ucFactor = result.factors.find(f => f.name === 'pendingUCAgeing');
      expect(ucFactor?.value).toBeGreaterThan(0);
    });
  });

  describe('calculateEvidenceScore', () => {
    it('should give LOW evidence for AS-DAR-0821 (old inspection, no recent milestones, high variance)', () => {
      const result = calculateEvidenceScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], [], now);
      expect(result.score).toBeLessThan(50);
      expect(result.components.geoTaggedPhotoRecency).toBeLessThan(20);
      expect(result.components.milestoneCertification).toBeLessThan(30);
    });

    it('should give HIGH evidence for AS-MAJ-0301 (recent inspection, verified milestones, low variance)', () => {
      const result = calculateEvidenceScore(mockProjects[3], mockInspections['AS-MAJ-0301'], mockMilestones['AS-MAJ-0301'] || [], [], now);
      expect(result.score).toBeGreaterThan(70);
      expect(result.components.geoTaggedPhotoRecency).toBeGreaterThan(30);
      expect(result.components.milestoneCertification).toBeGreaterThan(20);
    });

    it('should include citizen reports component', () => {
      const citizenReports = [{ id: 'g1', projectWorkId: 'AS-DAR-0821', district: 'Darrang', status: 'UNDER_REVIEW', ticketCode: 'GRV-001', userId: 'user1', category: 'QUALITY', department: 'PHED', description: 'Test grievance', mediaJson: null, latitude: 26.4352, longitude: 91.8841, assignedTo: 'officer1', resolutionNotes: null, resolvedAt: null, feedbackRating: null, attachmentPath: null, escalationLevel: 0, timelineJson: null, createdAt: new Date(), updatedAt: new Date() }];
      const result = calculateEvidenceScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], citizenReports, now);
      expect(result.components.citizenReports).toBeGreaterThan(0);
    });

    it('should include UC status component', () => {
      const result = calculateEvidenceScore(mockProjects[0], mockInspections['AS-DAR-0821'], mockMilestones['AS-DAR-0821'], [], now);
      expect(result.components.ucStatus).toBeDefined();
    });
  });

  describe('detectDuplicateOrGhostAssets', () => {
    it('should detect duplicate within 150m with same contractor', () => {
      const target = { id: 'NEW-001', latitude: 26.4352, longitude: 91.8841, title: 'Water Supply Phase 2', contractor: 'M/s Brahmaputra Infra-Engg Ltd' };
      const pool = [{ id: 'AS-DAR-0821', latitude: 26.4353, longitude: 91.8842, title: 'Water Supply Phase 1', contractor: 'M/s Brahmaputra Infra-Engg Ltd' }];
      const result = detectDuplicateOrGhostAssets(target, pool);
      expect(result.isDuplicate).toBe(true);
      expect(result.matches.length).toBe(1);
      expect(result.matches[0].distanceMeters).toBeLessThan(150);
    });

    it('should NOT flag same contractor beyond 150m', () => {
      const target = { id: 'NEW-001', latitude: 26.5000, longitude: 92.0000, title: 'Different Project', contractor: 'M/s Brahmaputra Infra-Engg Ltd' };
      const pool = [{ id: 'AS-DAR-0821', latitude: 26.4352, longitude: 91.8841, title: 'Water Supply', contractor: 'M/s Brahmaputra Infra-Engg Ltd' }];
      const result = detectDuplicateOrGhostAssets(target, pool);
      expect(result.isDuplicate).toBe(false);
    });

    it('should flag similar name + proximity even with different contractor', () => {
      const target = { id: 'NEW-001', latitude: 26.4353, longitude: 91.8842, title: 'Sipajhar Water Supply Extension', contractor: 'Different Contractor', ucReference: null };
      const pool = [{ id: 'AS-DAR-0821', latitude: 26.4352, longitude: 91.8841, title: 'Sipajhar NESIDS-OTRI Water Supply', contractor: 'M/s Brahmaputra Infra-Engg Ltd', ucReference: null }];
      const result = detectDuplicateOrGhostAssets(target, pool);
      expect(result.isDuplicate).toBe(true);
      expect(result.matches[0].matchReason).toBe('proximity_similar_name');
    });

    it('should flag duplicate UC reference', () => {
      const target = { id: 'NEW-001', latitude: 26.4353, longitude: 91.8842, title: 'Unrelated Project', contractor: 'X', ucReference: 'UC-2024-001' };
      const pool = [{ id: 'AS-DAR-0821', latitude: 26.4352, longitude: 91.8841, title: 'Water Supply', contractor: 'Y', ucReference: 'UC-2024-001' }];
      const result = detectDuplicateOrGhostAssets(target, pool);
      expect(result.isDuplicate).toBe(true);
      expect(result.matches[0].matchReason).toBe('duplicate_uc_reference');
    });
  });

  describe('calculateEquityLens', () => {
    it('should aggregate funding and delivery by ADC area', () => {
      const result = calculateEquityLens(mockProjects);
      expect(result.byAdcArea).toHaveProperty('BTC');
      expect(result.byAdcArea).toHaveProperty('Non-ADC');
      expect(result.byAdcArea['BTC'].totalFunding).toBe(6.2);
      expect(result.byAdcArea['BTC'].totalPhysicalDelivery).toBe(45.0);
    });

    it('should calculate per-capita proxy (funding per project)', () => {
      const result = calculateEquityLens(mockProjects);
      expect(result.byAdcArea['Non-ADC'].avgFundingPerProject).toBeGreaterThan(0);
    });

    it('should identify underserved blocks', () => {
      const result = calculateEquityLens(mockProjects);
      expect(result.underservedBlocks).toBeInstanceOf(Array);
    });

    it('should return equity index (0-100)', () => {
      const result = calculateEquityLens(mockProjects);
      expect(result.equityIndex).toBeGreaterThanOrEqual(0);
      expect(result.equityIndex).toBeLessThanOrEqual(100);
    });
  });
});