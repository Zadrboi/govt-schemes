import { NextRequest, NextResponse } from 'next/server';
import { grievanceUpdateSchema } from '@/lib/validation';
import { getCurrentUser, canAccessGrievance, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const grievance = await prisma.grievance.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, district: true } },
        projectWork: { select: { id: true, workCode: true, title: true, district: true } },
      },
    });

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: 'Grievance not found' },
        { status: 404 }
      );
    }

    // STRICT SERVER-SIDE AUTHORIZATION
    if (!canAccessGrievance(user, { userId: grievance.userId, district: grievance.district })) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await writeAuditLog({
      actorId: user.id,
      action: 'GRIEVANCE_VIEW',
      entityType: 'Grievance',
      entityId: grievance.id,
      metadataJson: JSON.stringify({ ticketCode: grievance.ticketCode }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    console.error('Get grievance error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve grievance' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const data = grievanceUpdateSchema.parse(body);

    const grievance = await prisma.grievance.findUnique({
      where: { id },
    });

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: 'Grievance not found' },
        { status: 404 }
      );
    }

    // STRICT SERVER-SIDE AUTHORIZATION
    if (!canAccessGrievance(user, { userId: grievance.userId, district: grievance.district })) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Citizens can only update their own grievances and only if status allows
    if (user.role === 'CITIZEN') {
      // Citizens can't change status directly
      delete data.status;
      delete data.escalationLevel;
    }

    // Build timeline entry
    const existingTimeline = grievance.timelineJson ? JSON.parse(grievance.timelineJson) : [];
    const newEntry = {
      date: new Date().toISOString(),
      action: `Status updated to ${data.status || grievance.status} by ${user.name} (${user.role})`,
      status: data.status || grievance.status,
    };

    const updated = await prisma.grievance.update({
      where: { id },
      data: {
        ...data,
        timelineJson: JSON.stringify([...existingTimeline, newEntry]),
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'GRIEVANCE_UPDATE',
      entityType: 'Grievance',
      entityId: grievance.id,
      metadataJson: JSON.stringify({ ticketCode: grievance.ticketCode, changes: Object.keys(data) }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Update grievance error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update grievance' },
      { status: 500 }
    );
  }
}