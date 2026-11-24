import { NextRequest, NextResponse } from 'next/server';
import { reconciliationQuerySchema } from '@/lib/validation';
import { getCurrentUser, hasRole, writeAuditLog, getClientIp, hashIp, applyRateLimit } from '@/lib/security/auth';
import {
  detectStalledWork,
  detectFinancialPhysicalMismatch,
  detectDuplicateOrGhostAssets,
} from '@/lib/intelligence/rules';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Authorization: CODISTRICT_OFFICER and above for reconciliation
    if (!hasRole(user.role, 'CODISTRICT_OFFICER')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Rate limiting
    const { allowed, headers } = await applyRateLimit(request, 'reconciliation', 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = reconciliationQuerySchema.parse(Object.fromEntries(searchParams));

    // Build base where clause with role filtering
    const where: any = {};
    if (user.role === 'FIELD_OFFICER' || user.role === 'CITIZEN') {
      where.district = user.district;
    } else if (query.district) {
      where.district = query.district;
    }
    if (query.adcArea) where.adcArea = query.adcArea;
    if (query.scheme) where.scheme = query.scheme;

    const projects = await prisma.projectWork.findMany({
      where,
      include: {
        milestones: true,
        inspections: { orderBy: { createdAt: 'desc' } },
        varianceFlags: { orderBy: { triggeredDate: 'desc' } },
      },
    });

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

    const results = {
      mismatch: [] as any[],
      stalled: [] as any[],
      pendingUC: [] as any[],
      duplicates: [] as any[],
    };

    for (const project of projects) {
      // Financial-physical mismatch
      const mismatch = detectFinancialPhysicalMismatch(project);
      if (mismatch.isMismatch && (!query.minVariance || mismatch.varianceGapPct >= query.minVariance)) {
        results.mismatch.push({
          project: { id: project.id, workCode: project.workCode, title: project.title, district: project.district },
          financialPct: mismatch.financialPct,
          physicalPct: mismatch.physicalPct,
          varianceGapPct: mismatch.varianceGapPct,
          severity: mismatch.severity,
          direction: mismatch.direction,
        });
      }

      // Stalled work
      const stalled = detectStalledWork(project, project.milestones, project.inspections, now);
      if (stalled.isStalled && (!query.minStalledDays || stalled.stalledDays >= query.minStalledDays)) {
        results.stalled.push({
          project: { id: project.id, workCode: project.workCode, title: project.title, district: project.district },
          stalledDays: stalled.stalledDays,
          severity: stalled.severity,
          lastActivityDate: stalled.lastActivityDate,
          activitySource: stalled.activitySource,
        });
      }

      // Pending UC
      if (project.ucStatus === 'PENDING' || project.ucStatus === 'SUBMITTED') {
        const sanctionDate = new Date(project.sanctionDate);
        const ucAgeDays = Math.floor((now.getTime() - sanctionDate.getTime()) / (1000 * 60 * 60 * 24));
        results.pendingUC.push({
          project: { id: project.id, workCode: project.workCode, title: project.title, district: project.district },
          ucStatus: project.ucStatus,
          ucAgeDays,
          sanctionDate: project.sanctionDate,
          pendingAmount: project.pendingAmount,
        });
      }

      // Duplicate detection
      const duplicate = detectDuplicateOrGhostAssets(
        { id: project.id, latitude: project.latitude, longitude: project.longitude, title: project.title, contractor: project.contractor || '' },
        allProjects.filter(p => p.id !== project.id && p.district === project.district)
      );
      if (duplicate.isDuplicate) {
        results.duplicates.push({
          project: { id: project.id, workCode: project.workCode, title: project.title, district: project.district },
          matches: duplicate.matches,
        });
      }
    }

    // Filter by type if specified
    let filteredResults: any = {};
    if (query.type === 'all' || query.type === 'mismatch') filteredResults.mismatch = results.mismatch;
    if (query.type === 'all' || query.type === 'stalled') filteredResults.stalled = results.stalled;
    if (query.type === 'all' || query.type === 'pendingUC') filteredResults.pendingUC = results.pendingUC;
    if (query.type === 'all' || query.type === 'duplicates') filteredResults.duplicates = results.duplicates;

    // Pagination
    const allItems = Object.values(filteredResults).flat();
    const total = allItems.length;
    const start = (query.page - 1) * query.limit;
    const paginatedItems = allItems.slice(start, start + query.limit);

    // CSV export
    if (query.format === 'csv') {
      const csv = generateCSV(results);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="reconciliation-${now.toISOString().split('T')[0]}.csv"`,
          ...headers,
        },
      });
    }

    await writeAuditLog({
      actorId: user.id,
      action: 'RECONCILIATION_VIEW',
      entityType: 'Reconciliation',
      entityId: 'bulk',
      metadataJson: JSON.stringify({ type: query.type, filters: query }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      {
        success: true,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        summary: {
          mismatchCount: results.mismatch.length,
          stalledCount: results.stalled.length,
          pendingUCCount: results.pendingUC.length,
          duplicateCount: results.duplicates.length,
        },
        data: paginatedItems,
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
    console.error('Reconciliation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate reconciliation' },
      { status: 500 }
    );
  }
}

function generateCSV(results: any): string {
  const lines = ['Type,Work Code,Title,District,Details'];
  for (const item of results.mismatch) {
    lines.push(`Mismatch,"${item.project.workCode}","${item.project.title}","${item.project.district}","Financial: ${item.financialPct}%, Physical: ${item.physicalPct}%, Gap: ${item.varianceGapPct}%, Severity: ${item.severity}"`);
  }
  for (const item of results.stalled) {
    lines.push(`Stalled,"${item.project.workCode}","${item.project.title}","${item.project.district}","Stalled Days: ${item.stalledDays}, Severity: ${item.severity}"`);
  }
  for (const item of results.pendingUC) {
    lines.push(`Pending UC,"${item.project.workCode}","${item.project.title}","${item.project.district}","UC Status: ${item.ucStatus}, Age: ${item.ucAgeDays} days, Pending: ${item.pendingAmount} Cr"`);
  }
  for (const item of results.duplicates) {
    for (const match of item.matches) {
      lines.push(`Duplicate,"${item.project.workCode}","${item.project.title}","${item.project.district}","Match: ${match.projectId}, Distance: ${match.distanceMeters}m, Reason: ${match.matchReason}"`);
    }
  }
  return lines.join('\n');
}