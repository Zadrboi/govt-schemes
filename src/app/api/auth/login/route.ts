export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { authenticateUser, createSessionToken, setSessionCookie, setMfaVerifiedCookie, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await authenticateUser(data.email, data.password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If MFA enabled but not verified via TOTP in this request
    if (user.mfaEnabled && !user.mfaVerified) {
      if (!data.totpCode) {
        // Return partial session requiring MFA
        const token = await createSessionToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          district: user.district,
          preferredLang: user.preferredLang,
          mfaVerified: false,
        });
        await setSessionCookie(token);

        return NextResponse.json({
          success: true,
          mfaRequired: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              district: user.district,
              preferredLang: user.preferredLang,
              mfaEnabled: true,
              mfaVerified: false,
            },
          },
        });
      }

      // Verify TOTP
      const { verifyTOTP } = await import('@/lib/validation');
      const userRecord = await (await import('@/lib/db/prisma')).default.user.findUnique({ where: { id: user.id } });
      if (!userRecord?.mfaSecret || !verifyTOTP(data.totpCode, userRecord.mfaSecret)) {
        return NextResponse.json(
          { success: false, error: 'Invalid MFA code' },
          { status: 401 }
        );
      }

      user.mfaVerified = true;
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      district: user.district,
      preferredLang: user.preferredLang,
      mfaVerified: user.mfaVerified,
    });

    await setSessionCookie(token);
    if (user.mfaVerified) {
      await setMfaVerifiedCookie();
    }

    // Audit log
    await writeAuditLog({
      actorId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      metadataJson: JSON.stringify({ email: user.email, mfaUsed: user.mfaEnabled }),
      ipHash: hashIp(getClientIp(request)),
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          district: user.district,
          preferredLang: user.preferredLang,
          mfaEnabled: user.mfaEnabled,
          mfaVerified: user.mfaVerified,
        },
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}