import { NextRequest, NextResponse } from 'next/server';
import { projectQuerySchema, projectCreateSchema } from '@/lib/validation';
import { getCurrentUser, requireRole, canCreateProjects, writeAuditLog, getClientIp, hashIp, applyRateLimit } from '@/lib/security/auth';
import {
  detectStalledWork,
  detectFinancialPhysicalMismatch,
  calculateDelayRiskScore,
  calculateEvidenceScore,
  detectDuplicateOrGhostAssets,
} from '@/lib/intelligence/rules';
import prisma from '@/lib/db/prisma';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const { allowed, headers } = await applyRateLimit(request, 'projects:list', 60, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    const user = await getCurrentUser();
    // Allow public access under RTI 2005 & GIGW 3.0 proactive transparency
    const isPublic = !user;
    const userRole = user?.role || 'CITIZEN';

    const { searchParams } = new URL(request.url);
    const query = projectQuerySchema.parse(Object.fromEntries(searchParams));

    // Build where clause with role-based filtering
    const where: any = {};

    // Role-based access: public and DC/Admin can see statewide
    if (user && user.role === 'FIELD_OFFICER' && user.district) {
      where.district = user.district;
    }

    if (query.district) where.district = query.district;
    if (query.coDistrict) where.coDistrict = query.coDistrict;
    if (query.block) where.block = query.block;
    if (query.adcArea) where.adcArea = query.adcArea;
    if (query.scheme) where.scheme = query.scheme;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { workCode: { contains: query.search } },
        { title: { contains: query.search } },
        { contractor: { contains: query.search } },
        { executingOfficer: { contains: query.search } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.projectWork.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          milestones: { orderBy: { plannedDate: 'asc' } },
          inspections: { orderBy: { createdAt: 'desc' }, take: 5 },
          grievances: { where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED'] } } },
          varianceFlags: { orderBy: { triggeredDate: 'desc' }, take: 1 },
        },
      }),
      prisma.projectWork.count({ where }),
    ]);

    // Enrich with intelligence
    const now = new Date();
    const allProjects = await prisma.projectWork.findMany({
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

    const enrichedProjects = projects.map(project => {
      const stalled = detectStalledWork(project, project.milestones, project.inspections, now);
      const mismatch = detectFinancialPhysicalMismatch(project);
      const delayRisk = calculateDelayRiskScore(project, project.inspections, project.milestones, now, allProjects);
      const evidence = calculateEvidenceScore(project, project.inspections, project.milestones, project.grievances, now);

      // Duplicate detection within same district
      const districtProjects = allProjects.filter(p => p.id !== project.id && p.district === project.district);
      const duplicate = detectDuplicateOrGhostAssets(
        { id: project.id, latitude: project.latitude, longitude: project.longitude, title: project.title, contractor: project.contractor || '' },
        districtProjects.map(p => ({ id: p.id, latitude: p.latitude, longitude: p.longitude, title: p.title, contractor: p.contractor || '' }))
      );

      return {
        ...project,
        intelligence: {
          stalledWork: stalled,
          financialPhysicalMismatch: mismatch,
          delayRiskScore: delayRisk,
          evidenceScore: evidence,
          duplicateDetection: duplicate,
        },
        qrCodePayload: generateQRPayload(project),
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: enrichedProjects.length,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        data: enrichedProjects,
      },
      { headers }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('List projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Authorization: FIELD_OFFICER and above can create projects
    if (!canCreateProjects(user)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = projectCreateSchema.parse(body);

    // Check workCode uniqueness
    const existing = await prisma.projectWork.findUnique({ where: { workCode: data.workCode } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Work code already exists' },
        { status: 409 }
      );
    }

    const project = await prisma.projectWork.create({
      data: {
        ...data,
        sanctionDate: new Date(data.sanctionDate),
        plannedStartDate: new Date(data.plannedStartDate),
        plannedEndDate: new Date(data.plannedEndDate),
        actualStartDate: data.actualStartDate ? new Date(data.actualStartDate) : null,
        actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : null,
        lastInspectionDate: data.lastInspectionDate ? new Date(data.lastInspectionDate) : null,
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'PROJECT_CREATE',
      entityType: 'ProjectWork',
      entityId: project.id,
      metadataJson: JSON.stringify({ workCode: project.workCode, scheme: project.scheme }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

function generateQRPayload(project: any): string {
  const payload = {
    v: 1,
    id: project.workCode,
    title: project.title,
    scheme: project.scheme,
    district: project.district,
    coords: [project.latitude, project.longitude],
    status: project.status,
    physical: project.physicalCompletionPct,
    financial: project.financialSanction > 0 ? Math.round((project.expenditure / project.financialSanction) * 1000) / 10 : 0,
    updated: project.updatedAt,
  };
  return JSON.stringify(payload);
}