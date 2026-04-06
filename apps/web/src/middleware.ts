import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/images/')) return true;
  if (pathname === '/favicon.ico') return true;

  return false;
}

async function hasValidSession(
  request: NextRequest,
  password: string | undefined
): Promise<boolean> {
  if (!password) return false;
  const sessionCookie = request.cookies.get('realtypro_session');
  if (!sessionCookie?.value) return false;
  try {
    const { unsealData } = await import('iron-session');
    const session = await unsealData<{ userId?: string; accessToken?: string }>(
      sessionCookie.value,
      { password }
    );
    return !!(session.userId && session.accessToken);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const password = process.env.SESSION_SECRET;

  if (pathname === '/login' || pathname === '/register') {
    if (await hasValidSession(request, password)) {
      return NextResponse.redirect(new URL('/search', request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!password) {
    console.error('[middleware] SESSION_SECRET is not set — blocking access to protected routes');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!(await hasValidSession(request, password))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
