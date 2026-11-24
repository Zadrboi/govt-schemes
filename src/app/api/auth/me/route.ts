import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/security/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

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
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}