import { describe, it, expect, beforeEach, vi } from 'vitest';
import { canAccessProject, canAccessInspection, canAccessNotice, canAccessGrievance } from '@/lib/security/authorization';

vi.mock('@/lib/db/prisma', () => ({
  default: {
    projectWork: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    fieldInspection: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    governmentNotice: {
      findUnique: vi.fn(),
    },
    grievance: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { default as rawPrisma } from '@/lib/db/prisma';
const mockPrisma = rawPrisma as any;

describe('Security: IDOR (Insecure Direct Object References) Protection', () => {
  const mockCitizenUser = {
    id: 'user-1',
    email: 'citizen@demo.yojna',
    name: 'Test Citizen',
    role: 'CITIZEN' as const,
    district: 'Darrang',
    preferredLang: 'en',
    mfaVerified: true,
  };

  const mockOfficerUser = {
    ...mockCitizenUser,
    id: 'officer-1',
    email: 'officer@demo.yojna',
    name: 'Field Officer',
    role: 'FIELD_OFFICER' as const,
  };

  const mockDCUser = {
    ...mockCitizenUser,
    id: 'dc-1',
    email: 'dc@demo.yojna',
    name: 'DC Commissioner',
    role: 'DC_COMMISSIONER' as const,
  };

  const mockAdminUser = {
    ...mockCitizenUser,
    id: 'admin-1',
    email: 'admin@demo.yojna',
    name: 'Admin',
    role: 'ADMIN' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Project Access Control', () => {
    it('denies citizen access to project in different district', async () => {
      const project = {
        id: 'project-other-district',
        workCode: 'AS-KAM-001',
        title: 'Kamrup Project',
        district: 'Kamrup',
        coDistrict: null,
        status: 'ACTIVE',
      };

      mockPrisma.projectWork.findUnique.mockResolvedValue(project);

      const hasAccess = await canAccessProject(mockCitizenUser, project.id);
      expect(hasAccess).toBe(false);
    });

    it('allows citizen access to project in their district', async () => {
      const project = {
        id: 'project-same-district',
        workCode: 'AS-DAR-0821',
        title: 'Darrang Flagship Project',
        district: 'Darrang',
        coDistrict: null,
        status: 'ACTIVE',
      };

      mockPrisma.projectWork.findUnique.mockResolvedValue(project);

      const hasAccess = await canAccessProject(mockCitizenUser, project.id);
      expect(hasAccess).toBe(true);
    });

    it('allows field officer access to projects in assigned district', async () => {
      const project = {
        id: 'project-officer-district',
        workCode: 'AS-DAR-0821',
        title: 'Darrang Project',
        district: 'Darrang',
        coDistrict: null,
        status: 'ACTIVE',
      };

      mockPrisma.projectWork.findUnique.mockResolvedValue(project);

      const hasAccess = await canAccessProject(mockOfficerUser, project.id);
      expect(hasAccess).toBe(true);
    });

    it('allows DC commissioner access to all projects in their district', async () => {
      const project = {
        id: 'project-dc-district',
        workCode: 'AS-DAR-0821',
        title: 'Darrang Project',
        district: 'Darrang',
        coDistrict: 'Mangaldoi',
        status: 'ACTIVE',
      };

      mockPrisma.projectWork.findUnique.mockResolvedValue(project);

      const hasAccess = await canAccessProject(mockDCUser, project.id);
      expect(hasAccess).toBe(true);
    });

    it('allows admin access to all projects', async () => {
      const project = {
        id: 'project-any-district',
        workCode: 'AS-KAM-001',
        title: 'Kamrup Project',
        district: 'Kamrup',
        coDistrict: null,
        status: 'ACTIVE',
      };

      mockPrisma.projectWork.findUnique.mockResolvedValue(project);

      const hasAccess = await canAccessProject(mockAdminUser, project.id);
      expect(hasAccess).toBe(true);
    });

    it('denies access to non-existent project', async () => {
      mockPrisma.projectWork.findUnique.mockResolvedValue(null);

      const hasAccess = await canAccessProject(mockCitizenUser, 'non-existent');
      expect(hasAccess).toBe(false);
    });
  });

  describe('Inspection Access Control', () => {
    it('denies citizen access to inspection of project in different district', async () => {
      const inspection = {
        id: 'inspection-1',
        projectId: 'project-other-district',
        projectWork: {
          district: 'Kamrup',
        },
      };

      mockPrisma.fieldInspection.findUnique.mockResolvedValue(inspection);

      const hasAccess = await canAccessInspection(mockCitizenUser, inspection.id);
      expect(hasAccess).toBe(false);
    });

    it('allows field officer access to inspections they created', async () => {
      const inspection = {
        id: 'inspection-officer',
        projectId: 'project-1',
        inspectorId: 'officer-1',
        projectWork: {
          district: 'Darrang',
        },
      };

      mockPrisma.fieldInspection.findUnique.mockResolvedValue(inspection);

      const hasAccess = await canAccessInspection(mockOfficerUser, inspection.id);
      expect(hasAccess).toBe(true);
    });

    it('denies field officer access to inspections they did not create in other district', async () => {
      const inspection = {
        id: 'inspection-other',
        projectId: 'project-other',
        inspectorId: 'officer-2',
        projectWork: {
          district: 'Kamrup',
        },
      };

      mockPrisma.fieldInspection.findUnique.mockResolvedValue(inspection);

      const hasAccess = await canAccessInspection(mockOfficerUser, inspection.id);
      expect(hasAccess).toBe(false);
    });
  });

  describe('Notice Access Control', () => {
    it('allows public access to published notices', async () => {
      const notice = {
        id: 'notice-public',
        status: 'PUBLISHED',
        isPublic: true,
      };

      mockPrisma.governmentNotice.findUnique.mockResolvedValue(notice);

      const hasAccess = await canAccessNotice(mockCitizenUser, notice.id);
      expect(hasAccess).toBe(true);
    });

    it('denies citizen access to draft notices', async () => {
      const notice = {
        id: 'notice-draft',
        status: 'DRAFT',
        isPublic: false,
        createdById: 'admin-1',
      };

      mockPrisma.governmentNotice.findUnique.mockResolvedValue(notice);

      const hasAccess = await canAccessNotice(mockCitizenUser, notice.id);
      expect(hasAccess).toBe(false);
    });

    it('allows author access to their draft notices', async () => {
      const notice = {
        id: 'notice-draft-author',
        status: 'DRAFT',
        isPublic: false,
        createdById: 'user-1',
      };

      mockPrisma.governmentNotice.findUnique.mockResolvedValue(notice);

      const hasAccess = await canAccessNotice(mockCitizenUser, notice.id);
      expect(hasAccess).toBe(true);
    });

    it('allows admin access to all notices', async () => {
      const notice = {
        id: 'notice-any',
        status: 'DRAFT',
        isPublic: false,
        createdById: 'other-user',
      };

      mockPrisma.governmentNotice.findUnique.mockResolvedValue(notice);

      const hasAccess = await canAccessNotice(mockAdminUser, notice.id);
      expect(hasAccess).toBe(true);
    });
  });

  describe('Grievance Access Control', () => {
    it('allows citizen to access their own grievances', async () => {
      const grievance = {
        id: 'grievance-own',
        citizenId: 'user-1',
      };

      mockPrisma.grievance.findUnique.mockResolvedValue(grievance);

      const hasAccess = await canAccessGrievance(mockCitizenUser, grievance.id);
      expect(hasAccess).toBe(true);
    });

    it('denies citizen access to other citizens grievances', async () => {
      const grievance = {
        id: 'grievance-other',
        citizenId: 'user-2',
      };

      mockPrisma.grievance.findUnique.mockResolvedValue(grievance);

      const hasAccess = await canAccessGrievance(mockCitizenUser, grievance.id);
      expect(hasAccess).toBe(false);
    });

    it('allows field officer access to grievances in their district', async () => {
      const grievance = {
        id: 'grievance-district',
        citizenId: 'user-2',
        projectWork: {
          district: 'Darrang',
        },
      };

      mockPrisma.grievance.findUnique.mockResolvedValue(grievance);

      const hasAccess = await canAccessGrievance(mockOfficerUser, grievance.id);
      expect(hasAccess).toBe(true);
    });

    it('allows admin access to all grievances', async () => {
      const grievance = {
        id: 'grievance-any',
        citizenId: 'user-2',
        projectWork: {
          district: 'Kamrup',
        },
      };

      mockPrisma.grievance.findUnique.mockResolvedValue(grievance);

      const hasAccess = await canAccessGrievance(mockAdminUser, grievance.id);
      expect(hasAccess).toBe(true);
    });
  });
});