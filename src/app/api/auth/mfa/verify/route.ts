import { NextRequest, NextResponse } from 'next/server';
import { mfaVerifySchema } from '@/lib/validation';
import { getCurrentUser, createSessionToken, setSessionCookie, setMfaVerifiedCookie, writeAuditLog, getClientIp, hashIp, verifyAndEnableMfa } from '@/lib/security/auth';

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
    const data = mfaVerifySchema.parse(body);

    // Verify the code matches the user's secret
    const { verifyTOTP } = await import('@/lib/validation');
    const userRecord = await (await import('@/lib/db/prisma')).default.user.findUnique({ where: { id: user.id } });
    if (!userRecord?.mfaSecret) {
      return NextResponse.json(
        { success: false, error: 'MFA not set up' },
        { status: 400 }
      );
    }

    const valid = verifyTOTP(data.code, userRecord.mfaSecret);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid MFA code' },
        { status: 401 }
      );
    }

    // If this is initial setup, enable MFA
    if (!user.mfaEnabled) {
      await verifyAndEnableMfa(user.id, data.code);
    }

    // Update session with MFA verified
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      district: user.district,
      preferredLang: user.preferredLang,
      mfaVerified: true,
    });

    await setSessionCookie(token);
    await setMfaVerifiedCookie();

    await writeAuditLog({
      actorId: user.id,
      action: 'MFA_VERIFY',
      entityType: 'User',
      entityId: user.id,
      metadataJson: JSON.stringify({ setup: !user.mfaEnabled }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json({
      success: true,
      data: {
        mfaEnabled: true,
        mfaVerified: true,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('MFA verify error:', error);
    return NextResponse.json(
      { success: false, error: 'MFA verification failed' },
      { status: 500 }
    );
  }
}