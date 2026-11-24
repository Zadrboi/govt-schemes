export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, applyRateLimit } from '@/lib/security/auth';
import {
  detectStalledWork,
  detectFinancialPhysicalMismatch,
  calculateDelayRiskScore,
  calculateEquityLens,
} from '@/lib/intelligence/rules';
import prisma from '@/lib/db/prisma';
import { CANONICAL_PROJECTS } from '@/lib/data/canonical';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Rate limiting
    const { allowed, headers } = await applyRateLimit(request, 'dashboard', 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    // Build role-based where clause
    const where: any = {};
    if (user.role === 'CITIZEN' || user.role === 'FIELD_OFFICER') {
      where.district = user.district;
    }

    // Fetch projects with related data
    let projects: any[] = [];
    let allProjects: any[] = [];

    try {
      projects = await prisma.projectWork.findMany({
        where,
        include: {
          milestones: true,
          inspections: { orderBy: { createdAt: 'desc' } },
          grievances: { where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED'] } } },
          varianceFlags: { orderBy: { triggeredDate: 'desc' }, take: 1 },
        },
      });

      allProjects = await prisma.projectWork.findMany({
        select: {
          id: true,
          contractor: true,
          latitude: true,
          longitude: true,
          title: true,
          district: true,
          state: true,
          plannedEndDate: true,
          plannedStartDate: true,
          actualStartDate: true,
          actualEndDate: true,
          physicalCompletionPct: true,
          financialSanction: true,
          sanctionedCost: true,
          fundReleased: true,
          expenditure: true,
          status: true,
          workCode: true,
          scheme: true,
          fundingAgency: true,
          sanctionDate: true,
          revisedCost: true,
          coDistrict: true,
          adcArea: true,
          block: true,
          implementingAgency: true,
          executingOfficer: true,
          technicalSanctionRef: true,
          villageWard: true,
          imagePath: true,
          ucStatus: true,
          pendingAmount: true,
          lastInspectionDate: true,
          outcomeIndicators: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (dbErr) {
      console.warn('Dashboard DB query fallback to canonical:', dbErr);
    }

    if (projects.length === 0) {
      projects = CANONICAL_PROJECTS.map(p => ({
        ...p,
        financialSanction: p.sanctionedCost,
        expenditure: p.fundReleased,
        milestones: p.milestones || [],
        inspections: p.inspections || [],
        grievances: [],
        varianceFlags: [],
      }));
      allProjects = projects;
    }

    // Calculate intelligence for each project
    const now = new Date();
    let stalledCount = 0;
    let mismatchCount = 0;
    let criticalRiskCount = 0;
    let highRiskCount = 0;
    let totalFinancial = 0;
    let totalExpenditure = 0;
    let totalPhysical = 0;

    for (const project of projects) {
      const stalled = detectStalledWork(project, project.milestones, project.inspections, now);
      if (stalled.isStalled) stalledCount++;

      const mismatch = detectFinancialPhysicalMismatch(project);
      if (mismatch.isMismatch) mismatchCount++;

      const delayRisk = calculateDelayRiskScore(project, project.inspections, project.milestones, now, allProjects);
      if (delayRisk.category === 'CRITICAL') criticalRiskCount++;
      else if (delayRisk.category === 'HIGH') highRiskCount++;

      totalFinancial += project.financialSanction;
      totalExpenditure += project.expenditure;
      totalPhysical += project.physicalCompletionPct;
    }

    const avgPhysical = projects.length > 0 ? totalPhysical / projects.length : 0;
    const financialUtilization = totalFinancial > 0 ? (totalExpenditure / totalFinancial) * 100 : 0;

    // Equity lens
    const equityLens = calculateEquityLens(projects);

    // Role-specific data
    let roleData: any = {};

    if (user.role === 'CITIZEN') {
      // My grievances, nearby projects, notices
      const myGrievances = await prisma.grievance.count({
        where: { userId: user.id },
      });
      const nearbyProjects = projects.filter(p => {
        // Simple distance check - within 50km
        return true; // Simplified
      }).slice(0, 5);

      roleData = {
        myGrievancesCount: myGrievances,
        nearbyProjects: nearbyProjects.map(p => ({
          id: p.id,
          workCode: p.workCode,
          title: p.title,
          status: p.status,
          physicalCompletionPct: p.physicalCompletionPct,
        })),
      };
    } else if (user.role === 'FIELD_OFFICER') {
      // My inspections, assigned projects, pending grievances
      const myInspections = await prisma.fieldInspection.count({
        where: { officerId: user.id },
      });
      const pendingGrievances = await prisma.grievance.count({
        where: { district: user.district, status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      });

      roleData = {
        myInspectionsCount: myInspections,
        pendingGrievancesCount: pendingGrievances,
        assignedProjects: projects.slice(0, 10).map(p => ({
          id: p.id,
          workCode: p.workCode,
          title: p.title,
          status: p.status,
          lastInspectionDate: p.lastInspectionDate,
        })),
      };
    } else if (['CODISTRICT_OFFICER', 'DC_COMMISSIONER', 'ADMIN'].includes(user.role)) {
      // District overview, reconciliation summary, notices
      const totalGrievances = await prisma.grievance.count({
        where: user.role === 'ADMIN' ? {} : { district: user.district },
      });
      const pendingNotices = await prisma.governmentNotice.count({
        where: { status: 'ACTIVE' },
      });
      const totalUsers = await prisma.user.count({
        where: user.role === 'ADMIN' ? {} : { district: user.district },
      });

      roleData = {
        totalGrievances,
        pendingNotices,
        totalUsers,
        reconciliationSummary: {
          mismatchCount,
          stalledCount,
          criticalRiskCount,
          highRiskCount,
        },
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            district: user.district,
            preferredLang: user.preferredLang,
          },
          summary: {
            totalProjects: projects.length,
            stalledProjects: stalledCount,
            mismatchProjects: mismatchCount,
            criticalRiskProjects: criticalRiskCount,
            highRiskProjects: highRiskCount,
            financialUtilization: Math.round(financialUtilization * 10) / 10,
            avgPhysicalProgress: Math.round(avgPhysical * 10) / 10,
            totalFinancialSanction: Math.round(totalFinancial * 100) / 100,
            totalExpenditure: Math.round(totalExpenditure * 100) / 100,
          },
          equityLens: {
            equityIndex: equityLens.equityIndex,
            underservedBlocks: equityLens.underservedBlocks,
            recommendations: equityLens.recommendations,
          },
          roleData,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}