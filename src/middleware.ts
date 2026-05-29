import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/admin', '/orders', '/checkout'];

export function middleware(req: NextRequest) {
  const isProtected = PROTECTED.some(p => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();
  const auth = req.cookies.get('elevens_auth');
  if (!auth) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*'],
};
