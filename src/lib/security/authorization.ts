/**
 * Poorvottar Drishti — Authorization & Access Control
 * Role-based access control with district-level isolation for IDOR prevention.
 */

import prisma from '@/lib/db/prisma';

export type UserRole = 'CITIZEN' | 'FIELD_OFFICER' | 'DC_COMMISSIONER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  district?: string;
  preferredLang: string;
  mfaVerified: boolean;
}

export interface ProjectWithAccess {
  id: string;
  workCode: string;
  title: string;
  district: string;
  coDistrict: string | null;
  status: string;
}

/**
 * Check if user can access a project based on role and district
 */
export async function canAccessProject(user: AuthUser, projectId: string): Promise<boolean> {
  const project = await prisma.projectWork.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      district: true,
      coDistrict: true,
      status: true,
    },
  });

  if (!project) return false;

  // Admin has access to everything
  if (user.role === 'ADMIN') return true;

  // DC Commissioner has access to all projects in their district
  if (user.role === 'DC_COMMISSIONER' && user.district === project.district) {
    return true;
  }

  // Field Officer has access to projects in their assigned district
  if (user.role === 'FIELD_OFFICER' && user.district === project.district) {
    return true;
  }

  // Citizen has access to projects in their district only
  if (user.role === 'CITIZEN' && user.district === project.district) {
    return true;
  }

  return false;
}

/**
 * Check if user can access a field inspection
 */
export async function canAccessInspection(user: AuthUser, inspectionId: string): Promise<boolean> {
  const inspection = await prisma.fieldInspection.findUnique({
    where: { id: inspectionId },
    include: {
      projectWork: {
        select: {
          district: true,
        },
      },
    },
  });

  if (!inspection) return false;

  // Admin has access to everything
  if (user.role === 'ADMIN') return true;

  // Inspector who created it has access
  if ((inspection as any).inspectorId === user.id || (inspection as any).officerId === user.id) return true;

  // DC Commissioner has access to inspections in their district
  if (user.role === 'DC_COMMISSIONER' && user.district === inspection.projectWork.district) {
    return true;
  }

  // Field Officer has access to inspections in their district
  if (user.role === 'FIELD_OFFICER' && user.district === inspection.projectWork.district) {
    return true;
  }

  // Citizen can view inspections of projects in their district (read-only)
  if (user.role === 'CITIZEN' && user.district === inspection.projectWork.district) {
    return true;
  }

  return false;
}

/**
 * Check if user can access a government notice
 */
export async function canAccessNotice(user: AuthUser, noticeId: string): Promise<boolean> {
  const notice = await prisma.governmentNotice.findUnique({
    where: { id: noticeId },
  }) as any;

  if (!notice) return false;

  // Active public notices are accessible to all authenticated users
  if ((notice.status === 'ACTIVE' || notice.status === 'PUBLISHED') && notice.isPublic !== false) return true;

  // Admin has access to everything
  if (user.role === 'ADMIN') return true;

  // Author can access their own drafts
  if (notice.createdById && notice.createdById === user.id) return true;

  // DC Commissioner and Field Officer can access notices
  if (['DC_COMMISSIONER', 'FIELD_OFFICER', 'CODISTRICT_OFFICER'].includes(user.role)) {
    return true;
  }

  return false;
}

/**
 * Check if user can access a grievance
 */
export async function canAccessGrievance(user: AuthUser, grievanceId: string): Promise<boolean> {
  const grievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    include: {
      projectWork: {
        select: {
          district: true,
        },
      },
    },
  });

  if (!grievance) return false;

  // Admin has access to everything
  if (user.role === 'ADMIN') return true;

  // Citizen can access their own grievances
  if (user.role === 'CITIZEN' && (grievance.userId === user.id || (grievance as any).citizenId === user.id)) return true;

  // Field Officer can access grievances in their district
  if (user.role === 'FIELD_OFFICER' && user.district === grievance.projectWork?.district) {
    return true;
  }

  // DC Commissioner can access grievances in their district
  if (user.role === 'DC_COMMISSIONER' && user.district === grievance.projectWork?.district) {
    return true;
  }

  return false;
}

/**
 * Check if user can modify a project (create/update/delete)
 */
export async function canModifyProject(user: AuthUser, projectId?: string): Promise<boolean> {
  // Only Field Officer, DC Commissioner, Admin can create projects
  if (!['FIELD_OFFICER', 'DC_COMMISSIONER', 'ADMIN'].includes(user.role)) {
    return false;
  }

  // If projectId provided, check district access for update/delete
  if (projectId) {
    return canAccessProject(user, projectId);
  }

  return true;
}

/**
 * Check if user can create inspections
 */
export function canCreateInspection(user: AuthUser): boolean {
  return ['FIELD_OFFICER', 'DC_COMMISSIONER', 'ADMIN'].includes(user.role);
}

/**
 * Check if user can create notices
 */
export function canCreateNotice(user: AuthUser): boolean {
  return ['DC_COMMISSIONER', 'ADMIN'].includes(user.role);
}

/**
 * Check if user can moderate grievances
 */
export function canModerateGrievance(user: AuthUser): boolean {
  return ['FIELD_OFFICER', 'DC_COMMISSIONER', 'ADMIN'].includes(user.role);
}

/**
 * Get allowed actions for a user on a resource
 */
export async function getAllowedActions(
  user: AuthUser,
  resourceType: 'project' | 'inspection' | 'notice' | 'grievance',
  resourceId?: string
): Promise<string[]> {
  const actions: string[] = [];

  // Read access
  let canRead = false;
  switch (resourceType) {
    case 'project':
      canRead = resourceId ? await canAccessProject(user, resourceId) : true;
      break;
    case 'inspection':
      canRead = resourceId ? await canAccessInspection(user, resourceId) : true;
      break;
    case 'notice':
      canRead = resourceId ? await canAccessNotice(user, resourceId) : true;
      break;
    case 'grievance':
      canRead = resourceId ? await canAccessGrievance(user, resourceId) : true;
      break;
  }

  if (canRead) actions.push('read');

  // Write access based on role
  const isOfficerOrAbove = ['FIELD_OFFICER', 'DC_COMMISSIONER', 'ADMIN'].includes(user.role);
  const isDCOrAbove = ['DC_COMMISSIONER', 'ADMIN'].includes(user.role);
  const isAdmin = user.role === 'ADMIN';

  switch (resourceType) {
    case 'project':
      if (isOfficerOrAbove && (!resourceId || await canModifyProject(user, resourceId))) {
        actions.push('create', 'update', 'delete');
      }
      break;
    case 'inspection':
      if (canCreateInspection(user)) actions.push('create');
      if (resourceId && (await canAccessInspection(user, resourceId)) && isOfficerOrAbove) {
        actions.push('update');
      }
      break;
    case 'notice':
      if (canCreateNotice(user)) actions.push('create', 'update', 'delete', 'publish');
      break;
    case 'grievance':
      if (canModerateGrievance(user)) actions.push('update', 'assign', 'close');
      if (!resourceId) actions.push('create'); // Anyone authenticated can create
      break;
  }

  return actions;
}