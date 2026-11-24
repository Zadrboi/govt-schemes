export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { noticeUpdateSchema } from '@/lib/validation';
import { getCurrentUser, canManageNotices, canPublishNotices, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';
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

    const notice = await prisma.governmentNotice.findUnique({
      where: { id },
    });

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    // Citizens only see ACTIVE notices
    if (user.role === 'CITIZEN' && notice.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    await writeAuditLog({
      actorId: user.id,
      action: 'NOTICE_VIEW',
      entityType: 'GovernmentNotice',
      entityId: notice.id,
      metadataJson: JSON.stringify({ title: notice.title }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error('Get notice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notice' },
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

    // Authorization: CODISTRICT_OFFICER and above can update
    if (!canManageNotices(user)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const data = noticeUpdateSchema.parse(body);

    const notice = await prisma.governmentNotice.findUnique({
      where: { id },
    });

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    // Only DC_COMMISSIONER and ADMIN can change status to PUBLISHED/AMENDED/SUPERSEDED
    if (data.status && !canPublishNotices(user)) {
      delete data.status;
    }

    const updated = await prisma.governmentNotice.update({
      where: { id },
      data: {
        ...data,
        effectiveAt: data.effectiveAt ? new Date(data.effectiveAt) : undefined,
        lastReviewedAt: new Date(),
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'NOTICE_UPDATE',
      entityType: 'GovernmentNotice',
      entityId: notice.id,
      metadataJson: JSON.stringify({ title: notice.title, changes: Object.keys(data) }),
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
    console.error('Update notice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notice' },
      { status: 500 }
    );
  }
}