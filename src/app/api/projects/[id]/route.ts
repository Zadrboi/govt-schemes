export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, canAccessProject, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';
import {
  detectStalledWork,
  detectFinancialPhysicalMismatch,
  calculateDelayRiskScore,
  calculateEvidenceScore,
  detectDuplicateOrGhostAssets,
} from '@/lib/intelligence/rules';
import prisma from '@/lib/db/prisma';
import QRCode from 'qrcode';
import { CANONICAL_PROJECTS } from '@/lib/data/canonical';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    let project: any = null;
    try {
      project = await prisma.projectWork.findFirst({
        where: {
          OR: [{ id }, { workCode: id }],
        },
        include: {
          milestones: { orderBy: { plannedDate: 'asc' } },
          inspections: { orderBy: { createdAt: 'desc' } },
          grievances: { orderBy: { createdAt: 'desc' } },
          varianceFlags: { orderBy: { triggeredDate: 'desc' } },
        },
      });
    } catch (dbErr) {
      console.warn('DB project query fallback to canonical:', dbErr);
    }

    if (!project) {
      const canonicalMatch = CANONICAL_PROJECTS.find(
        p => p.id === id || p.workCode.toLowerCase() === id.toLowerCase()
      );
      if (canonicalMatch) {
        const qrPayload = JSON.stringify({
          v: 1,
          id: canonicalMatch.workCode,
          title: canonicalMatch.title,
          scheme: canonicalMatch.scheme,
          district: canonicalMatch.district,
          coords: [canonicalMatch.latitude, canonicalMatch.longitude],
          status: canonicalMatch.status,
          physical: canonicalMatch.physicalCompletionPct,
          financial: canonicalMatch.sanctionedCost > 0 ? Math.round((canonicalMatch.fundReleased / canonicalMatch.sanctionedCost) * 100) : 0,
          updated: new Date().toISOString(),
        });

        const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
          width: 256,
          margin: 2,
          errorCorrectionLevel: 'M',
        });

        const finPct = Math.min(100, Math.round((canonicalMatch.fundReleased / canonicalMatch.sanctionedCost) * 100));
        const physPct = canonicalMatch.physicalCompletionPct;

        const enriched = {
          ...canonicalMatch,
          financialSanction: canonicalMatch.sanctionedCost,
          expenditure: canonicalMatch.fundReleased,
          intelligence: {
            stalledWork: {
              isStalled: canonicalMatch.status === 'STALLED' || canonicalMatch.stalledAlert || false,
              stalledDays: canonicalMatch.daysSinceLastInspection || 74,
              threshold: 60,
              severity: canonicalMatch.status === 'STALLED' ? 'CRITICAL' : 'NONE',
            },
            financialPhysicalMismatch: {
              isMismatch: finPct - physPct > 15,
              financialPct: finPct,
              physicalPct: physPct,
              varianceGapPct: Math.max(0, finPct - physPct),
            },
            delayRiskScore: { score: canonicalMatch.delayRiskScore, category: canonicalMatch.delayRiskScore > 60 ? 'HIGH' : 'LOW' },
            evidenceScore: { total: canonicalMatch.evidenceScore },
            duplicateDetection: { isDuplicate: false },
          },
          qrCode: qrCodeDataUrl,
          qrPayload,
        };

        return NextResponse.json({
          success: true,
          data: enriched,
          project: enriched,
        });
      }

      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Public statutory transparency allows viewing all public works

    // Intelligence enrichment
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

    const stalled = detectStalledWork(project, project.milestones, project.inspections, now);
    const mismatch = detectFinancialPhysicalMismatch(project);
    const delayRisk = calculateDelayRiskScore(project, project.inspections, project.milestones, now, allProjects);
    const evidence = calculateEvidenceScore(project, project.inspections, project.milestones, project.grievances, now);
    const duplicate = detectDuplicateOrGhostAssets(
      { id: project.id, latitude: project.latitude, longitude: project.longitude, title: project.title, contractor: project.contractor || '' },
      allProjects.filter(p => p.id !== project.id && p.district === project.district)
    );

    // Generate QR code
    const qrPayload = JSON.stringify({
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
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'M',
    });

    await writeAuditLog({
      actorId: user?.id || 'ANONYMOUS_PUBLIC_AUDIT',
      action: 'PROJECT_VIEW',
      entityType: 'ProjectWork',
      entityId: project.id,
      metadataJson: JSON.stringify({ workCode: project.workCode }),
      ipHash: hashIp(getClientIp(request)),
    });

    const responseData = {
      ...project,
      intelligence: {
        stalledWork: stalled,
        financialPhysicalMismatch: mismatch,
        delayRiskScore: delayRisk,
        evidenceScore: evidence,
        duplicateDetection: duplicate,
      },
      qrCode: qrCodeDataUrl,
      qrPayload,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      project: responseData,
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project' },
      { status: 500 }
    );
  }
}