export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser, writeAuditLog } from '@/lib/security/auth';
import { getClientIp, hashIp } from '@/lib/security/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    await clearSessionCookie();

    if (userId) {
      await writeAuditLog({
        actorId: userId,
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: userId,
        ipHash: hashIp(getClientIp(new Request('http://localhost'))),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}