import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/security/auth';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/asset',
  '/assets',
  '/verify',
  '/notices',
  '/eligibility',
  '/directory',
  '/insights',
  '/dashboard', // Dashboard handles role switching & demo preview gracefully
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/mfa/verify',
  '/api/health',
  '/api/schemes',
  '/api/notices',
  '/api/assistant',
  '/api/projects',
  '/api/reconciliation',
  '/api/inspections',
  '/api/grievances',
  '/api/dashboard',
  '/api/speech',
];

const STRICT_PROTECTED_PATHS = [
  '/api/drafts',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const { allowed, headers } = await applyRateLimit(request, 'global', 100, 60000);
    const response = allowed ? NextResponse.next() : NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429 }
    );
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Check if path is strictly protected
  const isStrictProtected = STRICT_PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (isStrictProtected) {
    const sessionToken = request.cookies.get('drishti_session')?.value || request.cookies.get('yojna_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
