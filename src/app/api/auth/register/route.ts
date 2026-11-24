import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { registerUser, createSessionToken, setSessionCookie, writeAuditLog, getClientIp, hashIp } from '@/lib/security/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const user = await registerUser(data);
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      district: user.district,
      preferredLang: user.preferredLang,
      mfaVerified: user.mfaVerified,
    });

    await setSessionCookie(token);

    // Audit log
    await writeAuditLog({
      actorId: user.id,
      action: 'USER_REGISTER',
      entityType: 'User',
      entityId: user.id,
      metadataJson: JSON.stringify({ email: user.email, role: user.role }),
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
        },
      },
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Email or phone already registered' },
        { status: 409 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}