import { NextRequest, NextResponse } from 'next/server';
import { draftCreateSchema, draftUpdateSchema } from '@/lib/validation';
import { getCurrentUser, canAccessDraft, writeAuditLog, getClientIp, hashIp, applyRateLimit } from '@/lib/security/auth';
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
    const { allowed, headers } = await applyRateLimit(request, 'drafts:list', 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers }
      );
    }

    // Users only see their own drafts (or admin sees all)
    const where: any = { userId: user.id };
    if (user.role === 'ADMIN') {
      where.userId = undefined; // Admin sees all
    }

    const drafts = await prisma.formDraft.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(
      {
        success: true,
        count: drafts.length,
        data: drafts,
      },
      { headers }
    );
  } catch (error) {
    console.error('List drafts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve drafts' },
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

    const body = await request.json();
    const data = draftCreateSchema.parse(body);

    // Upsert by userId + formType (unique constraint)
    const draft = await prisma.formDraft.upsert({
      where: {
        userId_formType: {
          userId: user.id,
          formType: data.formType,
        },
      },
      update: {
        step: data.step,
        payloadJson: data.payloadJson,
      },
      create: {
        userId: user.id,
        formType: data.formType,
        step: data.step,
        payloadJson: data.payloadJson,
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: 'DRAFT_SAVE',
      entityType: 'FormDraft',
      entityId: draft.id,
      metadataJson: JSON.stringify({ formType: data.formType, step: data.step }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json(
      { success: true, data: draft },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Save draft error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}