import { NextRequest, NextResponse } from 'next/server';
import { noticeQuerySchema, noticeCreateSchema } from '@/lib/validation';
import { getCurrentUser, canManageNotices, canPublishNotices, writeAuditLog, getClientIp, hashIp, applyRateLimit } from '@/lib/security/auth';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const role = user?.role || 'CITIZEN';

    // Rate limiting
    const { allowed, headers } = await applyRateLimit(request, 'notices:list', 60, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = noticeQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.issuingAuthority) where.issuingAuthority = { contains: query.issuingAuthority };
    if (query.startDate) where.publishedAt = { ...where.publishedAt, gte: new Date(query.startDate) };
    if (query.endDate) where.publishedAt = { ...where.publishedAt, lte: new Date(query.endDate) };

    // Citizens see only ACTIVE notices
    if (role === 'CITIZEN') {
      where.status = 'ACTIVE';
    }

    const [notices, total] = await Promise.all([
      prisma.governmentNotice.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.governmentNotice.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: notices.length,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        data: notices,
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
    console.error('List notices error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notices' },
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

    // Authorization: CODISTRICT_OFFICER and above can create notices
    if (!canManageNotices(user)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = noticeCreateSchema.parse(body);

    // Only DC_COMMISSIONER and ADMIN can publish directly
    const status = canPublishNotices(user) ? data.status : 'ACTIVE';

    const notice = await prisma.governmentNotice.create({
      data: {
        ...data,
        publishedAt: new Date(data.publishedAt),
        effectiveAt: data.effectiveAt ? new Date(data.effectiveAt) : null,
        status,
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'NOTICE_CREATE',
      entityType: 'GovernmentNotice',
      entityId: notice.id,
      metadataJson: JSON.stringify({ title: notice.title, status }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      { success: true, data: notice },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Create notice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}