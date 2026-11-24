export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { inspectionCreateSchema } from '@/lib/validation';
import { getCurrentUser, requireRole, canCreateProjects, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Authorization: FIELD_OFFICER and above can submit inspections
    if (!canCreateProjects(user)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = inspectionCreateSchema.parse(body);

    // Check project exists and user has access
    const project = await prisma.projectWork.findUnique({
      where: { id: data.projectWorkId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Idempotency check via offlineClientId
    const existing = await prisma.fieldInspection.findUnique({
      where: { offlineClientId: data.offlineClientId },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, data: existing, message: 'Inspection already recorded (idempotent)' },
        { status: 200 }
      );
    }

    // Create inspection
    const inspection = await prisma.fieldInspection.create({
      data: {
        projectWorkId: data.projectWorkId,
        officerId: user.id,
        gpsLat: data.gpsLat,
        gpsLng: data.gpsLng,
        photoPath: data.photoPath,
        exifTimestamp: data.exifTimestamp ? new Date(data.exifTimestamp) : null,
        qualityFlagsJson: data.qualityFlagsJson,
        notes: data.notes,
        offlineClientId: data.offlineClientId,
      },
    });

    // Update project lastInspectionDate
    await prisma.projectWork.update({
      where: { id: data.projectWorkId },
      data: { lastInspectionDate: inspection.exifTimestamp || inspection.createdAt },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'INSPECTION_CREATE',
      entityType: 'FieldInspection',
      entityId: inspection.id,
      metadataJson: JSON.stringify({
        projectWorkId: data.projectWorkId,
        offlineClientId: data.offlineClientId,
        gpsLat: data.gpsLat,
        gpsLng: data.gpsLng,
      }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      { success: true, data: inspection },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Create inspection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inspection' },
      { status: 500 }
    );
  }
}