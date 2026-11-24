import { NextRequest, NextResponse } from 'next/server';
import { grievanceQuerySchema, grievanceCreateSchema } from '@/lib/validation';
import { getCurrentUser, canAccessGrievance, writeAuditLog, getClientIp, hashIp, applyRateLimit, hasRole } from '@/lib/security/auth';
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

    // Rate limiting
    const { allowed, headers } = await applyRateLimit(request, 'grievances:list', 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = grievanceQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = {};

    // STRICT SERVER-SIDE AUTHORIZATION:
    // Citizens can only see their own grievances
    // Officials can see grievances in their jurisdiction
    if (user.role === 'CITIZEN') {
      where.userId = user.id;
    } else if (user.role === 'FIELD_OFFICER') {
      where.district = user.district;
    }
    // CODISTRICT_OFFICER, DC_COMMISSIONER, ADMIN see all (or filtered by query)

    if (query.userId && hasRole(user.role, 'CODISTRICT_OFFICER')) where.userId = query.userId;
    if (query.projectWorkId) where.projectWorkId = query.projectWorkId;
    if (query.category) where.category = query.category;
    if (query.status) where.status = query.status;
    if (query.district && hasRole(user.role, 'CODISTRICT_OFFICER')) where.district = query.district;

    const [grievances, total] = await Promise.all([
      prisma.grievance.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          user: { select: { id: true, name: true, email: true, district: true } },
          projectWork: { select: { id: true, workCode: true, title: true } },
        },
      }),
      prisma.grievance.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: grievances.length,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        data: grievances,
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
    console.error('List grievances error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve grievances' },
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

    // Rate limiting stricter for creation
    const { allowed, headers } = await applyRateLimit(request, 'grievances:create', 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const data = grievanceCreateSchema.parse(body);

    // Generate ticket code
    const ticketCode = `GRIEV-${new Date().getFullYear()}-${user.district?.substring(0, 3).toUpperCase() || 'ASM'}-${String(Date.now()).slice(-4)}`;

    const grievance = await prisma.grievance.create({
      data: {
        ticketCode,
        userId: user.id,
        projectWorkId: data.projectWorkId,
        category: data.category,
        department: data.department,
        district: data.district,
        description: data.description,
        attachmentPath: data.attachmentPath,
        status: 'SUBMITTED',
        escalationLevel: 1,
        timelineJson: JSON.stringify([
          { date: new Date().toISOString(), action: 'Grievance filed by citizen', status: 'SUBMITTED' },
        ]),
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'GRIEVANCE_CREATE',
      entityType: 'Grievance',
      entityId: grievance.id,
      metadataJson: JSON.stringify({ ticketCode, category: data.category, projectWorkId: data.projectWorkId }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      { success: true, data: grievance },
      { status: 201, headers }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Create grievance error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create grievance' },
      { status: 500 }
    );
  }
}